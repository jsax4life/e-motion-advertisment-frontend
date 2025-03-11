import React from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../base-components/Pagination";
import { FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { formatCurrency, formatDate } from "../../utils/utils";
import LoadingIcon from "../../base-components/LoadingIcon";

interface Campaign {
  id: number;
  client_id: string,
    campaign_name: string,
    campaign_start_date: string,
    campaign_end_date: string,
    status: string,
    campaign_duration: string,
    payment_option: string,
    media_purchase_order: string,
    total_order_amount: 0,
    discount_order_amount: 0,
    description: string,
}

interface DisplaySectionProps {
  loading: boolean;
  campaignList: Campaign[];
}

const ClientCampaign: React.FC<DisplaySectionProps> = ({
  loading,
  campaignList,
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



{campaignList && campaignList?.length === 0 ? (
                <div>No Campaign Yet</div>
               ) : (
                <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
                <Table className="border-spacing-y-[8px] border-separate">
                  <Table.Thead className="lg:h-10 text-slate-400">
                    <Table.Tr>
                    <Table.Th className="   whitespace-nowrap">
                              S/N
                            </Table.Th>
                            <Table.Th className="   whitespace-nowrap">
                              CAMPAIGN NAME
                            </Table.Th>
                            <Table.Th className="   whitespace-nowrap">
                              START DATE
                            </Table.Th>
                            <Table.Th className="   whitespace-nowrap">
                              END DATE
                            </Table.Th>
                            <Table.Th className="   whitespace-nowrap">
                              STATUS
                            </Table.Th>
                          
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {campaignList?.map((campaign, campaignKey) => (
                      <Table.Tr
                        key={campaignKey}
                        className="intro-x text-black capitalize"
                      >
                    
                        
                    <Table.Td className=" first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                                  <div className=" whitespace-nowrap">
                                    {campaignKey + 1}
                                  </div>
                                </Table.Td>
      
                      
      
      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white  dark:bg-darkmode-600 border-slate-200 border-b">
                                  <>
                                    <div className="whitespace-nowrap">
                                      {campaign?.campaign_name}
                                    </div>
                                  </>
                                </Table.Td>
      
                                
                                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                                  <>
                                    <div className=" whitespace-nowrap">
                                    {campaign?.campaign_start_date}
                                    </div>
                                  </>
                                </Table.Td>
                                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                                  <>
                                    <div className="whitespace-nowrap">
                                      {campaign?.campaign_end_date}
                                    </div>
                                  </>
                                </Table.Td>
                            
      
                                
                 
      
                        <Table.Td className="first:rounded-l-md   last:rounded-r-md text-start bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                         <div className="flex justify-center items-center space-x-2">
                         <div
                            className={`items-center lg:py-1 text-xs font-medium  border  w-2.5 h-2.5  rounded-full  ${
                              campaign?.status === "running"
                                ? "bg-green-600"
                                : "bg-orange-400"
                            }`}
                          ></div>
                          <div> {campaign?.status}</div>
                         </div>
                        </Table.Td>
                      
      
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
    
              )
            
               
        
                        }     

       
        </>
    
  );
};

export default ClientCampaign;
