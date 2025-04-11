import { ChevronRightIcon, HomeIcon, PlusIcon } from "lucide-react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb";
import { Button } from "../../../../components/ui/button";

export const MainContentSection = (): JSX.Element => {
  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h1 className="font-heading-h3 text-neutralneutral-1100-day text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
              Role Management
            </h1>
          </div>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-1">
                  <HomeIcon className="w-3 h-3" />
                  <span className="font-description text-neutralneutral-500-day text-[length:var(--description-font-size)] tracking-[var(--description-letter-spacing)] leading-[var(--description-line-height)] [font-style:var(--description-font-style)]">
                    Home
                  </span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRightIcon className="w-3 h-3" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className="font-description text-brandbrand-1 text-[length:var(--description-font-size)] tracking-[var(--description-letter-spacing)] leading-[var(--description-line-height)] [font-style:var(--description-font-style)]">
                  Campaigns
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex items-end gap-3">
        <Button className="bg-[#2774ff] hover:bg-[#2774ff]/90 text-shadeswhite rounded-lg flex items-center gap-2.5">
          <PlusIcon className="w-4 h-4" />
          <span className="font-semibold text-base">New Role</span>
        </Button>
      </div>
    </div>
  );
};
