import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";
import Lucide from "../../../base-components/Lucide";
import { formatDate } from "../../../utils/helper";

/* This example requires Tailwind CSS v2.0+ */
const statusStages: { [key: string]: string } = {
  pending: "Created By",
  approved: "Approved By",
  paid: "Paid By",
  delivered: "Delivered By",
};

export default function ApprrovalProcess({ statusLog }: any) {
  return (
    <div className="grid grid-cols-2 gap-4 capitalize ">
      <nav
        className="col-span-2 max-h-60  overflow-y-auto"
        aria-label="Directory"
      >
        <ul role="list" className="relative z-0 divide-y divide-gray-200">
          {statusLog?.map((log: any) => (
            <li key={log.id} className="bg-white flex space-x-6 items-center">
              <div className="relative  w-full py-2 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="admin"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <a href="#" className="focus:outline-none">
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    <div className="flex items-center space-x-2 text-[10px]  text-customColor">
                      <p className="">{statusStages[log?.new_status]}</p>{" "}
                      <Lucide
                        className="text-customColor w-1 h-1 fill-customColor"
                        icon="Circle"
                      />
                      <p>{log?.admin?.name}</p>
                    </div>
                    <p className="text-xs truncate font-medium text-gray-900">
                      {log?.admin?.firstName} {log.admin.lastName}
                    </p>
                  </a>
                </div>
              </div>
              <div className="w-auto  px-1 text-center ">
                <p className="text-[8px] px-1 rounded-sm  truncate font-medium  bg-green-100 text-green-700">
                  completed
                </p>
                <p className="text-[8px]  text-slate-600">
                  {formatDate(log?.updated_at, "MM-DD-YYYY")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
