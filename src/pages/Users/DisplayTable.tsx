import React from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../base-components/Pagination";
import { FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { formatCurrency, formatDate } from "../../utils/utils";
import LoadingIcon from "../../base-components/LoadingIcon";

interface User {
  id: number;
  name: string;
  firstName: string,
  lastName: string,
  role: [{'name': string}],
  date_created: string,
  active: any,
  created_at: string,

}

interface DisplaySectionProps {
  loading: boolean;
  userList: User[];
}

const usersStatus = [
  "Inactive",
  "Active",
]

const DisplayTable: React.FC<DisplaySectionProps> = ({
  loading,
  userList,
}) => {

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



{userList && userList?.length === 0 ? (
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
                              USER'S NAME
                            </Table.Th>
                            <Table.Th className="   whitespace-nowrap">
                              ROLE
                            </Table.Th>
                            <Table.Th className="   whitespace-nowrap">
                              DATE CREATED
                            </Table.Th>
                            <Table.Th className="   whitespace-nowrap">
                              STATUS
                            </Table.Th>
                           
                            <Table.Th className="text-center    whitespace-nowrap">
                              ACTION
                            </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {userList?.map((user, userKey) => (
                      <Table.Tr
                        key={userKey}
                        className="intro-x text-black capitalize"
                      >
                    
                        
                    <Table.Td className=" first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                                  <div className=" whitespace-nowrap">
                                    {userKey + 1}
                                  </div>
                                </Table.Td>
      
                      
      
      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white  dark:bg-darkmode-600 border-slate-200 border-b">
                                  <>
                                    <div className="whitespace-nowrap">
                                      {user?.firstName} {user?.lastName}
                                    </div>
                                  </>
                                </Table.Td>
      
                                
                                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                                  <>
                                    <div className=" whitespace-nowrap">
                                    {user?.name} 
                                    </div>
                                  </>
                                </Table.Td>
                              
                                <Table.Td className="first:rounded-l-md last:rounded-r-md w-40  bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                                  <div className="">
                                    {formatDate(user?.created_at)}
                                  </div>
                                </Table.Td>
                           
      
                                
                 
      
                        <Table.Td className="first:rounded-l-md   last:rounded-r-md text-start bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                         <div className="flex justify-center items-center space-x-2">
                         <div
                            className={`items-center lg:py-1 text-xs font-medium  border  w-2.5 h-2.5  rounded-full  ${
                              usersStatus[user?.active] === "Active"
                                ? "bg-green-600"
                                : "bg-orange-400"
                            }`}
                          ></div>
                          <div>   {usersStatus[user?.active]}</div>
                         </div>
                        </Table.Td>

                    
                      
      
                        <Table.Td className="first:rounded-l-md text-sm last:rounded-r-md bg-white border-slate-200 border-b dark:bg-darkmode-600 py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <Menu className="ml-3">
                            <Menu.Button className="w-5 h-5 text-slate-500">
                              <Lucide icon="MoreVertical" className="w-5 h-5" />
                            </Menu.Button>
                            <Menu.Items className="w-40">
                              <Menu.Item onClick={() => {navigate(`/user-details/${user?.id}`)}}>
                                <Lucide icon="Edit2" className="w-4 h-4 mr-2" /> View
                                Details
                              </Menu.Item>
                              <Menu.Item>
                                <Lucide icon="Edit2" className="w-4 h-4 mr-2" /> Edit
                                User
                              </Menu.Item>
                           
                            </Menu.Items>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
      
              {/* <Pagination
  totalPages={pagination.last_page}  // Use last_page as total pages
  currentPage={pagination.current_page}  // Track current page
  onPageChange={(page) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
    fetchClientData(page);  // Call API to fetch new page data
  }}
  pagination={pagination}
  fetchData={fetchClientData}
/> */}
              
              </>
               
              )
                        }     

       
        </>
    
  );
};

export default DisplayTable;
