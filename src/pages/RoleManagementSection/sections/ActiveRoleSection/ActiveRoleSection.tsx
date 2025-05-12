import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";

// type Role = {
//   name: string;
//   privileges: string[];
// };

// interface Props {
//   roles: any[];
//   // getActiveRole: (role: any) => void
//   activeRole: boolean
//   onRoleClick: (role: any) => void
// }

type Role = {
  id: number;
  name: string;
};


interface ActiveRoleSectionProps {
  roles: Role[];
  activeRole: Role;
  onRoleClick: (role: Role) => void;
}




export const ActiveRoleSection: React.FC<ActiveRoleSectionProps> = ({
  roles,
  activeRole,
  onRoleClick,
}) => {
  return (
    <div className="flex flex-col  gap-8 pr-4 pt-6 pl-1 w-1/4 rounded-[10px_0px_0px_10px] border border-solid border-neutralneutral-border-day">
      <nav className="self-stretch bg-neutralneutral-bg-day   h-full overflow-y-auto min-w-[200px] ">
        <div className="flex flex-col items-start gap-2 w-full">
          {roles.map((role) => {
            const isActive = role.id === activeRole.id;

            return (
              <Button
                key={role.id}
                onClick={() => onRoleClick(role)}
                variant={isActive ? "default" : "ghost"}
                className={`lg:w-full justify-start p-4 py-2.5 rounded-lg 
                  ${isActive 
                    ? "bg-[#2774ff] hover:bg-[#2774ff]/90"
                    : "bg-white hover:bg-gray-100"
                  }`}
              >
                <span
                  className={`font-semibold truncate font-['Poppins',Helvetica] text-sm leading-4 ${
                    isActive ? "text-white" : "text-neutralneutral-500-day"
                  }`}
                >
                  {role.name}
                </span>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
