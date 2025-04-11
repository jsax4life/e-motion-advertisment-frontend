import React from "react";
import { Separator } from "../../components/ui/separator";
import { ActiveCampaignsSection } from "./sections/ActiveCampaignsSection";
import { CampaignsSection } from "./sections/CampaignsSection/CampaignsSection";
import { ClientManagementSection } from "./sections/ClientManagementSection";
import { MainContentSection } from "./sections/MainContentSection";
import { PermissionsSection } from "./sections/PermissionsSection";
import { RoleManagementSection } from "./sections/RoleManagementSection/RoleManagementSection";
import { SettingsWrapperSection } from "./sections/SettingsWrapperSection";
import { UserRoleSection } from "./sections/UserRoleSection";

export const ErpRoleManagement = (): JSX.Element => {
  return (
 
        <div className="relative">
          
          {/* Main content area */}
          <div className=" w-[1139px]">
            <div className="flex flex-col gap-6">
              <MainContentSection />

              <div className="flex bg-white">
                {/* Left sidebar */}
                <ActiveCampaignsSection />

                {/* Main content with scrollable sections */}
                <div className="flex flex-col gap-8 p-6 flex-1 bg-neutralneutral-bg-day rounded-[0px_10px_10px_0px] border border-solid border-neutralneutral-border-day overflow-y-auto">
                  <SettingsWrapperSection />

                  <div className="flex flex-col gap-8 w-full border-b border-[#e4e4e499]">
                    <PermissionsSection />
                    <Separator className="w-full" />

                    <RoleManagementSection />
                    <Separator className="w-full" />

                    <ClientManagementSection />
                    <Separator className="w-full" />

                    <UserRoleSection />
                    <CampaignsSection />
                  </div>
                </div>
              </div>
            </div>
          </div>

        
        </div>
     
  );
};
