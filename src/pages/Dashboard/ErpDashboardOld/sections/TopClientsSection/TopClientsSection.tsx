import { ChevronRightIcon, FilterIcon, HomeIcon } from "lucide-react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "../../../../../components/ui/breadcrumb";
import { Button } from "../../../../../components/ui/button";

export const TopClientsSection = (): JSX.Element => {
  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex flex-col items-start gap-6">
        <div className="flex flex-col items-start gap-3 w-full">
          <div className="flex items-center gap-3 w-full">
            <h1 className="font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-neutralneutral-1100-day text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center justify-between w-full">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-1">
                    <HomeIcon className="w-3 h-3" />
                    <span className="font-description font-[number:var(--description-font-weight)] text-neutralneutral-500-day text-[length:var(--description-font-size)] tracking-[var(--description-letter-spacing)] leading-[var(--description-line-height)] [font-style:var(--description-font-style)]">
                      Home
                    </span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <ChevronRightIcon className="w-3 h-3" />
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-description font-[number:var(--description-font-weight)] text-brandbrand-1 text-[length:var(--description-font-size)] tracking-[var(--description-letter-spacing)] leading-[var(--description-line-height)] [font-style:var(--description-font-style)]">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="flex items-start justify-end gap-3">
          <Button
            variant="outline"
            className="h-10 gap-2.5 px-4 py-2 rounded-lg border border-solid border-[#2775ff] bg-transparent"
          >
            <FilterIcon className="w-4 h-4" />
            <span className="font-semibold text-[#2774ff] text-base">
              Filter
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
