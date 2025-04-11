import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

export const SettingsWrapperSection = (): JSX.Element => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <h2 className="font-heading-h6 text-neutralneutral-1100-day text-[length:var(--heading-h6-font-size)] tracking-[var(--heading-h6-letter-spacing)] leading-[var(--heading-h6-line-height)] whitespace-nowrap">
          Super Admin
        </h2>

        <Badge
          variant="outline"
          className="h-[18px] px-1 py-px bg-[#ec8c5626] border-none rounded-sm"
        >
          <span className="font-normal text-[#eb8b55] text-xs">
            This role&apos;s permissions cannot be changed
          </span>
        </Badge>
      </div>

      <Button
        variant="secondary"
        className="h-10 px-4 py-2 bg-[#c5cad8] hover:bg-[#c5cad8] rounded-lg"
        disabled
      >
        <span className="font-semibold text-shadeswhite text-base whitespace-nowrap">
          Save Settings
        </span>
      </Button>
    </div>
  );
};
