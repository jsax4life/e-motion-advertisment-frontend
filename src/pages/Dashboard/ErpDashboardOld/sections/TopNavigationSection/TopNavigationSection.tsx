import { BellIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../../components/ui/avatar";
import { Input } from "../../../../../components/ui/input";

export const TopNavigationSection = (): JSX.Element => {
  return (
    <header className="w-full h-24 border-b border-neutralneutral-border-day bg-neutralneutral-bg-day">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-1">
          <div className="relative w-[33.66px] h-[33.66px] rounded-full bg-[url(/ellipse-7.png)] bg-cover bg-[50%_50%]">
            <img
              className="absolute w-[30px] h-[22px] top-1.5 left-0.5 object-cover"
              alt="Lagos state seal"
              src="/lagos-state-seal-1.png"
            />
          </div>
          <div className="font-bold text-[#151522] text-[22.4px] leading-[29.2px]">
            Siitech
          </div>
        </div>

        {/* Search */}
        <div className="relative ml-10 flex-1 max-w-[360px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchIcon className="h-5 w-5 text-neutralneutral-300-day" />
          </div>
          <Input
            className="h-12 pl-10 bg-neutralneutral-100-day border-none rounded-xl font-description text-sm"
            placeholder="Search"
          />
        </div>

        {/* User section */}
        <div className="flex items-center gap-12">
          {/* Notification */}
          <div className="relative">
            <BellIcon className="w-6 h-6 text-dark" />
            <div className="absolute w-2 h-2 top-0 right-0 bg-accentsfuchsia rounded-xl" />
          </div>

          {/* User profile */}
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/no---circle---48px.png" alt="User avatar" />
              <AvatarFallback>MA</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start">
              <div className="font-body-normal text-text-secondary text-[14px]">
                Hello,
              </div>
              <div className="font-link-normal font-semibold text-dark text-[14px] leading-[21px]">
                Mustapha A.
              </div>
            </div>

            <ChevronDownIcon className="w-4 h-4 text-dark" />
          </div>
        </div>
      </div>
    </header>
  );
};
