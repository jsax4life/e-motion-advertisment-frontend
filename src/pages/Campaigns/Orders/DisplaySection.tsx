import React from "react";
import Pagination from "../../../base-components/Pagination";
import { FormSelect } from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import { Menu, Tab } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import { formatCurrency, formatDate } from "../../../utils/utils";

interface Order {
  id: number;
  client_id: string;
  billboard_id: string;
  campaign_name: string;
  campaign_duration: string;
  status: "approved" | "pending" | "paid" | "delivered" | "cancelled";
  slot: string;
  face: string;
  comment: string;
  // slot_or_face: "",
  start_date: string;
  end_date: string;
  payment_option: string;
  media_purchase_order: string;
  actual_amount: number;
  discount_amount: number;
  // Add other fields as needed
}

interface DisplaySectionProps {
  loading: boolean;
  orderList: Order[];
}

const DisplaySection: React.FC<DisplaySectionProps> = ({
  loading,
  orderList,
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="col-span-12 border rounded-2xl bg-white px-5 sm:px-6 intro-y">
      <div className="grid grid-cols-12 text-slate-600">
        <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
          <Table className="border-spacing-y-[8px] border-separate">
            <Table.Thead className="lg:h-10 text-slate-400">
              <Table.Tr>
                <Table.Th className="whitespace-nowrap">S/N</Table.Th>
                <Table.Th className="whitespace-nowrap">COMPANY NAME</Table.Th>
                <Table.Th className="whitespace-nowrap">
                  PAYMENT OPTION
                </Table.Th>
                <Table.Th className="whitespace-nowrap">START DATE</Table.Th>
                <Table.Th className="whitespace-nowrap">END DATE</Table.Th>
                <Table.Th className="text-start whitespace-nowrap">
                  STATUS
                </Table.Th>
                <Table.Th className="whitespace-nowrap">AMOUNT</Table.Th>
                <Table.Th className="text-center whitespace-nowrap">
                  ACTION
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {orderList.map((order, orderKey) => (
                <Table.Tr
                  key={orderKey}
                  className="intro-x text-black capitalize"
                >
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <div className="whitespace-nowrap">{orderKey + 1}</div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white dark:bg-darkmode-600 border-slate-200 border-b">
                    <div className="whitespace-nowrap">
                      {order?.campaign_name}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <div className="whitespace-nowrap">
                      {order?.payment_option}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <div className="whitespace-nowrap">
                      {formatDate(order?.start_date)}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <div>{formatDate(order?.end_date)}</div>
                  </Table.Td>

                  <Table.Td className="first:rounded-l-md   last:rounded-r-md text-start bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                   <div className="flex justify-center items-center space-x-2">
                   <div
                      className={`items-center lg:py-1 text-xs font-medium  border  w-2.5 h-2.5  rounded-full  ${
                        order?.status === "approved"
                          ? "bg-orange-400 border-orange-400"
                          : order?.status === "pending"
                          ? "bg-red-400 border-red-400"
                          : order?.status === "paid"
                          ? "bg-red-500 border-red-500"
                          : order?.status === "delivered"
                          ? "bg-green-500 border-green-500"
                          : "bg-red-500 border-red-500"
                      }`}
                    ></div>
                    <div> {order?.status}</div>
                   </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <div>&#x20A6;{formatCurrency(order?.actual_amount)}</div>
                  </Table.Td>

                  <Table.Td className="first:rounded-l-md text-sm last:rounded-r-md bg-white border-slate-200 border-b dark:bg-darkmode-600 py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <Menu className="ml-3">
                      <Menu.Button className="w-5 h-5 text-slate-500">
                        <Lucide icon="MoreVertical" className="w-5 h-5" />
                      </Menu.Button>
                      <Menu.Items className="w-40">
                        <Menu.Item>
                          <Lucide icon="Edit2" className="w-4 h-4 mr-2" /> View
                          Order
                        </Menu.Item>
                        <Menu.Item>
                          <Lucide icon="Edit2" className="w-4 h-4 mr-2" /> Edit
                          Order
                        </Menu.Item>
                        <Menu.Item className="text-red-500">
                          <Lucide icon="Trash" className="w-4 h-4 mr-2" />{" "}
                          Delete
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            <Pagination.Link>
              <Lucide icon="ChevronsLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>1</Pagination.Link>
            <Pagination.Link active>2</Pagination.Link>
            <Pagination.Link>3</Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronsRight" className="w-4 h-4" />
            </Pagination.Link>
          </Pagination>
          <FormSelect className="w-20 mt-3 !box sm:mt-0">
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </FormSelect>
        </div>
      </div>
    </div>
  );
};

export default DisplaySection;
