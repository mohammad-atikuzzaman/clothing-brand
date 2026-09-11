"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, Suspense } from "react";
import { pageview } from "@/lib/fpixel";

interface MetaPixelProps {
  pixelId?: string;
  isEnabled?: boolean;
}

function MetaPixelRouteTracker({ pixelId, isEnabled }: MetaPixelProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialLoaded = useRef(false);

  useEffect(() => {
    if (!pixelId || !isEnabled) return;

    if (initialLoaded.current) {
      pageview();
    } else {
      initialLoaded.current = true;
    }
  }, [pathname, searchParams, pixelId, isEnabled]);

  return null;
}

export function MetaPixel({ pixelId, isEnabled = true }: MetaPixelProps) {
  if (!pixelId || !isEnabled) {
    return null;
  }

  return (
    <>
      <Suspense fallback={null}>
        <MetaPixelRouteTracker pixelId={pixelId} isEnabled={isEnabled} />
      </Suspense>
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
