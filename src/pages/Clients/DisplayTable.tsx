import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../base-components/Pagination";
import { FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { formatCurrency, formatDate } from "../../utils/utils";
import LoadingIcon from "../../base-components/LoadingIcon";

interface Client {
  id: number;
  company_name: string,
  company_email: string,
  company_phone: string,
  contact_person_name: string,
  contact_person_email: string,
  contact_person_phone: string,
  client_type: string, 
  state: string,
  lga: string,
  company_address: string,
  birthday: string,
  brand_industry: string,
}

interface DisplaySectionProps {
  loading: boolean;
  clientList: Client[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }; // Pagination state
  setPagination: React.Dispatch<React.SetStateAction<{
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }>>; // Function to update pagination state
  fetchClientData: (page: number) => void; // Function to fetch client data
}

const DisplayTable: React.FC<DisplaySectionProps> = ({
  loading,
  clientList,
  pagination,
  setPagination,
  fetchClientData,
}) => {


  console.log(pagination);


  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>

    {loading && ( <div className="col-span-12 flex items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center w-full">
                  <LoadingIcon icon="bars" className="w-8 h-8" />
                  <div className="mt-2 text-xs text-center">Loading data</div>
                </div>
              </div>) 
              
              }



{clientList && clientList?.length === 0 ? (
                <div>No Data Yet</div>
               ) : (
                <>
                <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
                <Table className="border-spacing-y-[8px] border-separate">
                  <Table.Thead className="lg:h-10 text-slate-400">
                    <Table.Tr>
                    <Table.Th className="   whitespace-nowrap">
                              S/N
                            </Table.Th>
                            <Table.Th className="   whitespace-nowrap">
                              COMPANY NAME
                            </Table.Th>
                            <Table.Th className="   whitespace-nowrap">
                              CONTACT PERSON
                            </Table.Th>
                            <Table.Th className="   whitespace-nowrap">
                              CONTACT NUMBER
                            </Table.Th>
                            <Table.Th className="   whitespace-nowrap">
                              INDUSTRY
                            </Table.Th>
                            <Table.Th className="   whitespace-nowrap">
                              LOCATION
                            </Table.Th>
                          
                            <Table.Th className="text-start    whitespace-nowrap">
                              CLIENT TYPE
                            </Table.Th>
                          
                            <Table.Th className="text-center    whitespace-nowrap">
                              ACTION
                            </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {clientList?.map((client, clientKey) => (
                      <Table.Tr
                        key={clientKey}
                        className="intro-x text-black capitalize"
                      >
                    
                        
                    <Table.Td className=" first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                                  <div className=" whitespace-nowrap">
                                    {clientKey + 1}
                                  </div>
                                </Table.Td>
      
                      
      
      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white  dark:bg-darkmode-600 border-slate-200 border-b">
                                  <>
                                    <div className="whitespace-nowrap">
                                      {client?.company_name}
                                    </div>
                                  </>
                                </Table.Td>
      
                                
                                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                                  <>
                                    <div className=" whitespace-nowrap">
                                    {client?.contact_person_name}
                                    </div>
                                  </>
                                </Table.Td>
                                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                                  <>
                                    <div className="whitespace-nowrap">
                                      {client?.contact_person_phone}
                                    </div>
                                  </>
                                </Table.Td>
                                <Table.Td className="first:rounded-l-md last:rounded-r-md w-40  bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                                  <div className="">
                                    {client?.brand_industry}
                                  </div>
                                </Table.Td>
                                <Table.Td className="first:rounded-l-md last:rounded-r-md w-40  bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                                  <div className="">
                                    {client?.state}
                                  </div>
                                </Table.Td>
      
                                
                 
      
                        <Table.Td className="first:rounded-l-md   last:rounded-r-md text-start bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                         <div className="flex justify-center items-center space-x-2">
                         <div
                            className={`items-center lg:py-1 text-xs font-medium  border  w-2.5 h-2.5  rounded-full  ${
                              client?.client_type === "Direct"
                                ? "bg-green-600"
                                : "bg-orange-400"
                            }`}
                          ></div>
                          <div> {client?.client_type}</div>
                         </div>
                        </Table.Td>
                      
      
                        <Table.Td className="first:rounded-l-md text-sm last:rounded-r-md bg-white border-slate-200 border-b dark:bg-darkmode-600 py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <Menu className="ml-3">
                            <Menu.Button className="w-5 h-5 text-slate-500">
                              <Lucide icon="MoreVertical" className="w-5 h-5" />
                            </Menu.Button>
                            <Menu.Items className="w-40">
                              <Menu.Item onClick={() => {navigate(`/client-details/${client?.id}`)}}>
                                <Lucide icon="Edit2" className="w-4 h-4 mr-2" /> View
                                Client
                              </Menu.Item>
                              <Menu.Item>
                                <Lucide icon="Edit2" className="w-4 h-4 mr-2" /> Edit
                                Client
                              </Menu.Item>
                           
                            </Menu.Items>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
              <Pagination
  totalPages={pagination.last_page}  // Use last_page as total pages
  currentPage={pagination.current_page}  // Track current page
  onPageChange={(page) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
    fetchClientData(page);  // Call API to fetch new page data
  }}
  pagination={pagination}
  fetchData={fetchClientData}
/>
              
              </>
               
              )
                        }     

       
        </>
    
  );
};

export default DisplayTable;
