import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs text-neutral-400">
      <ol className="flex items-center flex-wrap gap-1.5">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#c19b65] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-neutral-500" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[#c19b65] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-neutral-700 font-medium truncate max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
