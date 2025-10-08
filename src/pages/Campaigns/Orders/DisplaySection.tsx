import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../base-components/Pagination";
import { FormSelect } from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import { Menu, Tab } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import { formatCurrency, formatDate } from "../../../utils/utils";
import DeleteConfirmationModal from "../../../base-components/DeleteConfirmationModal";
import { useOrderDeletion } from "../../../hooks/useOrderDeletion";
import Toastify from "toastify-js";


const statusColors = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  paid: "bg-blue-500",
  delivered: "bg-purple-500",
  frozen: "bg-red-500",
};


interface Order {
  id: number;
  client_id: string;
  billboard_id: string;
  campaign_name: string;
  order_id: string;
  billboards: Array<{ start_date: string; end_date: string }>;
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
  total_order_amount: number;
  discount_order_amount: number;
  // Add other fields as needed
}

interface DisplaySectionProps {
  loading: boolean;
  orderList: Order[];
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
  fetchCampaignData: (page: number) => void; // Function to fetch client data

}



const DisplaySection: React.FC<DisplaySectionProps> = ({
  loading,
  orderList,
  pagination,
  setPagination,
  fetchCampaignData,

}) => {

  const navigate = useNavigate();
  const { 
    deleteOrder, 
    forceDeleteOrder, 
    restoreOrder,
    isDeleting, 
    isRestoring,
    canDeleteOrder, 
    canForceDeleteOrder,
    canRestoreOrder 
  } = useOrderDeletion();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  console.log(orderList);

  const handleDeleteClick = (order: Order) => {
    console.log('handleDeleteClick called with order:', order);
    const { canDelete, reason } = canDeleteOrder(order);
    console.log('Can delete:', canDelete, 'Reason:', reason);
    
    if (!canDelete) {
      // Show error notification
      const errorEl = document
        .querySelectorAll("#failed-notification-content")[0]
        .cloneNode(true) as HTMLElement;
      errorEl.classList.remove("hidden");
      errorEl.querySelector(".notification-content")!.textContent = reason || "Cannot delete this order";
      
      Toastify({
        node: errorEl,
        duration: 5000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
      return;
    }

    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;

    try {
      await deleteOrder(orderToDelete);
      
      // Show success notification
      const successEl = document
        .querySelectorAll("#success-notification-content")[0]
        .cloneNode(true) as HTMLElement;
      successEl.classList.remove("hidden");
      successEl.querySelector(".notification-content")!.textContent = `Order "${orderToDelete.order_id}" deleted successfully`;
      
      Toastify({
        node: successEl,
        duration: 5000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();

      // Refresh the order list
      fetchCampaignData(pagination.current_page);
      
      // Close modal and reset state
      setDeleteModalOpen(false);
      setOrderToDelete(null);
    } catch (error: any) {
      // Show error notification
      const errorEl = document
        .querySelectorAll("#failed-notification-content")[0]
        .cloneNode(true) as HTMLElement;
      errorEl.classList.remove("hidden");
      errorEl.querySelector(".notification-content")!.textContent = error.message || "Failed to delete order";
      
      Toastify({
        node: errorEl,
        duration: 5000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
    }
  };

  const handleForceDeleteConfirm = async () => {
    if (!orderToDelete) return;

    try {
      await forceDeleteOrder(orderToDelete);
      
      // Show success notification
      const successEl = document
        .querySelectorAll("#success-notification-content")[0]
        .cloneNode(true) as HTMLElement;
      successEl.classList.remove("hidden");
      successEl.querySelector(".notification-content")!.textContent = `Order "${orderToDelete.order_id}" permanently deleted`;
      
      Toastify({
        node: successEl,
        duration: 5000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();

      // Refresh the order list
      fetchCampaignData(pagination.current_page);
      
      // Close modal and reset state
      setDeleteModalOpen(false);
      setOrderToDelete(null);
    } catch (error: any) {
      // Show error notification
      const errorEl = document
        .querySelectorAll("#failed-notification-content")[0]
        .cloneNode(true) as HTMLElement;
      errorEl.classList.remove("hidden");
      errorEl.querySelector(".notification-content")!.textContent = error.message || "Failed to permanently delete order";
      
      Toastify({
        node: errorEl,
        duration: 5000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="col-span-12 border rounded-2xl bg-white px-5 sm:px-6 intro-y">
      <div className="grid grid-cols-12 text-slate-600">
        <div className="col-span-12 overflow-x-auto intro-y 2xl:overflow-visible">
          <Table className="border-spacing-y-[8px] border-separate min-w-full">
            <Table.Thead className="lg:h-10 text-slate-400">
              <Table.Tr>
                <Table.Th className="whitespace-nowrap">S/N</Table.Th>
                <Table.Th className="whitespace-nowrap">CAMPAIGN NAME</Table.Th>
                <Table.Th className="whitespace-nowrap">ORDER NUMBER</Table.Th>

                <Table.Th className="whitespace-nowrap">
                  PAYMENT OPTION
                </Table.Th>
                <Table.Th className="whitespace-nowrap">START DATE</Table.Th>
                <Table.Th className="whitespace-nowrap">END DATE</Table.Th>
                <Table.Th className="text-start whitespace-nowrap">
                  STATUS
                </Table.Th>
                <Table.Th className="whitespace-nowrap">AMOUNT</Table.Th>
                <Table.Th className="text-center whitespace-nowrap w-20">
                  ACTION
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {orderList?.map((order, orderKey) => (
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
                    
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white dark:bg-darkmode-600 border-slate-200 border-b">
                    <div className="whitespace-nowrap">
                      {order?.order_id}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <div className="whitespace-nowrap">
                      {order?.payment_option}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md  text-xs bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <div className="whitespace-nowrap">
                      {formatDate(order?.billboards?.[0]?.start_date)}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 text-xs bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <div>{formatDate(order?.billboards?.[0]?.end_date)}</div>
                  </Table.Td>

                  <Table.Td className="first:rounded-l-md   last:rounded-r-md text-start bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                   <div className="flex justify-center items-center space-x-2">
                   <div
                      className={`items-center lg:py-1 text-xs font-medium  border  w-2.5 h-2.5  rounded-full 
                      
                      ${statusColors[order?.status as keyof typeof statusColors] || "bg-gray-500"} 
                      `}
                    ></div>
                    <div> {order?.status}</div>
                   </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <div>&#x20A6;{formatCurrency(order?.discount_order_amount || order?.total_order_amount)}</div>
                  </Table.Td>

                  <Table.Td className="first:rounded-l-md text-sm last:rounded-r-md bg-white border-slate-200 border-b dark:bg-darkmode-600 py-0 relative w-20 before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <Menu className="ml-3">
                      <Menu.Button className="w-5 h-5 text-slate-500">
                        <Lucide icon="MoreVertical" className="w-5 h-5" />
                      </Menu.Button>
                      <Menu.Items className="w-40 z-50">
                        <Menu.Item onClick={() => {navigate(`/campaigns/${order?.id}/details/order`)}}>
                          <Lucide icon="Edit2" className="w-4 h-4 mr-2" /> View
                          Order
                        </Menu.Item>
                        <Menu.Item>
                          <Lucide icon="Edit2" className="w-4 h-4 mr-2" /> Edit
                          Order
                        </Menu.Item>
                        <Menu.Item 
                          className="text-red-500 hover:bg-red-50 cursor-pointer"
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            console.log('Delete clicked for order:', order);
                            handleDeleteClick(order);
                          }}
                        >
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

        <Pagination
  totalPages={pagination.last_page}  // Use last_page as total pages
  currentPage={pagination.current_page}  // Track current page
  onPageChange={(page) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
    fetchCampaignData(page);  // Call API to fetch new page data
  }}
  pagination={pagination}
  fetchData={fetchCampaignData}
/>
        
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Order"
        message="Are you sure you want to delete this order? This will move it to the trash where it can be restored later."
        itemName={orderToDelete ? `${orderToDelete.order_id} - ${orderToDelete.campaign_name}` : ""}
        isLoading={isDeleting}
        confirmButtonText="Delete Order"
        cancelButtonText="Cancel"
        type="warning"
        showForceDelete={orderToDelete ? canForceDeleteOrder(orderToDelete).canDelete : false}
        onForceDelete={handleForceDeleteConfirm}
        isForceDeleting={isDeleting}
      />
    </div>
  );
};

export default DisplaySection;
