import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// items: [{ label, href? }]. The last item is the current page; items without href are plain text.
export function AdminBreadcrumbs({ items }) {
  return (
    <Breadcrumb className="mb-3">
      <BreadcrumbList>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={i}>
              <BreadcrumbItem className="min-w-0">
                {last ? (
                  <BreadcrumbPage className="truncate font-medium">{item.label}</BreadcrumbPage>
                ) : item.href ? (
                  <BreadcrumbLink
                    render={<Link href={item.href} />}
                    className="font-medium text-primary underline-offset-4 hover:text-primary hover:underline"
                  >{item.label}</BreadcrumbLink>
                ) : (
                  <span className="truncate">{item.label}</span>
                )}
              </BreadcrumbItem>
              {!last && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
