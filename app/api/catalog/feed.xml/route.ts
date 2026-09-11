import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ProductModel } from "@/lib/models/Product";
import { ensureDatabaseSeeded } from "@/lib/db/seed";

export const revalidate = 3600; // Cache feed for 1 hour

function escapeCdata(str: string): string {
  if (!str) return "";
  return str.replace(/]]>/g, "]]]]><![CDATA[>");
}

export async function GET() {
  try {
    await ensureDatabaseSeeded();
    await connectToDatabase();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://izhaanlifestyle.com";

    // Fetch active products
    const products = await ProductModel.find({}).lean().exec();

    const itemsXml = products
      .map((product) => {
        const id = product._id?.toString() || product.sku || product.slug;
        const title = product.name || "Izhaan Panjabi";
        const description =
          product.description ||
          `${product.name} - Premium Panjabi crafted from ${product.fabric || "Combed Cotton"}.`;
        const link = `${baseUrl}/product/${product.slug}`;
        const imageLink = product.image || "";
        const availability = product.inStock && (product.stockQuantity ?? 1) > 0 ? "in stock" : "out of stock";
        const price = `${Number(product.regularPrice || product.salePrice).toFixed(2)} BDT`;
        const salePrice =
          product.salePrice && product.salePrice < product.regularPrice
            ? `<g:sale_price>${Number(product.salePrice).toFixed(2)} BDT</g:sale_price>`
            : "";
        const category = product.category || "Panjabi";

        return `
    <item>
      <g:id>${id}</g:id>
      <g:title><![CDATA[${escapeCdata(title)}]]></g:title>
      <g:description><![CDATA[${escapeCdata(description)}]]></g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:brand>Izhaan</g:brand>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${price}</g:price>
      ${salePrice}
      <g:product_type><![CDATA[${escapeCdata(category)}]]></g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Izhaan Lifestyle Product Catalog</title>
    <link>${baseUrl}</link>
    <description>Automated product catalog feed for Meta (Facebook/Instagram) Shop &amp; Dynamic Ads</description>
    ${itemsXml}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=14400, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("Error generating catalog XML feed:", error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error</title></channel></rss>`,
      {
        status: 500,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      }
    );
  }
}
