import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../base-components/Pagination";
import { FormSelect } from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import { Menu } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import { formatCurrency, formatDate } from "../../../utils/utils";
import DeleteConfirmationModal from "../../../base-components/DeleteConfirmationModal";
import { useOrderDeletion } from "../../../hooks/useOrderDeletion";
import Toastify from "toastify-js";

interface Order {
  id: number;
  order_id: string;
  campaign_name: string;
  client_name: string;
  status: string;
  total_order_amount: number;
  discounted_total: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

interface DeletedOrdersSectionProps {
  loading: boolean;
  orderList: Order[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  setPagination: React.Dispatch<React.SetStateAction<{
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }>>;
  fetchCampaignData: (page: number) => void;
}

const DeletedOrdersSection: React.FC<DeletedOrdersSectionProps> = ({
  loading,
  orderList,
  pagination,
  setPagination,
  fetchCampaignData,
}) => {
  const navigate = useNavigate();
  const { 
    restoreOrder, 
    forceDeleteOrder,
    isRestoring, 
    isDeleting,
    canRestoreOrder, 
    canForceDeleteOrder 
  } = useOrderDeletion();
  
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [forceDeleteModalOpen, setForceDeleteModalOpen] = useState(false);
  const [orderToRestore, setOrderToRestore] = useState<Order | null>(null);
  const [orderToForceDelete, setOrderToForceDelete] = useState<Order | null>(null);

  const handleRestoreClick = (order: Order) => {
    const { canRestore, reason } = canRestoreOrder(order);
    
    if (!canRestore) {
      // Show error notification
      const errorEl = document
        .querySelectorAll("#failed-notification-content")[0]
        ?.cloneNode(true) as HTMLElement;
      
      if (errorEl) {
        errorEl.classList.remove("hidden");
        const notificationContent = errorEl.querySelector(".notification-content");
        if (notificationContent) {
          notificationContent.textContent = reason || "Cannot restore this order";
        }
      }
      
      if (errorEl) {
        Toastify({
          node: errorEl,
          duration: 5000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast();
      } else {
        alert(reason || "Cannot restore this order");
      }
      return;
    }

    setOrderToRestore(order);
    setRestoreModalOpen(true);
  };

  const handleForceDeleteClick = (order: Order) => {
    const { canDelete, reason } = canForceDeleteOrder(order);
    
    if (!canDelete) {
      // Show error notification
      const errorEl = document
        .querySelectorAll("#failed-notification-content")[0]
        ?.cloneNode(true) as HTMLElement;
      
      if (errorEl) {
        errorEl.classList.remove("hidden");
        const notificationContent = errorEl.querySelector(".notification-content");
        if (notificationContent) {
          notificationContent.textContent = reason || "Cannot permanently delete this order";
        }
      }
      
      if (errorEl) {
        Toastify({
          node: errorEl,
          duration: 5000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast();
      } else {
        alert(reason || "Cannot permanently delete this order");
      }
      return;
    }

    setOrderToForceDelete(order);
    setForceDeleteModalOpen(true);
  };

  const handleRestoreConfirm = async () => {
    if (!orderToRestore) return;

    try {
      const response = await restoreOrder(orderToRestore);
      
      // Show success notification
      const successEl = document
        .querySelectorAll("#success-notification-content")[0]
        ?.cloneNode(true) as HTMLElement;
      
      if (successEl) {
        successEl.classList.remove("hidden");
        
        // Try different selectors for the notification content
        let notificationContent = successEl.querySelector(".notification-content");
        if (!notificationContent) {
          notificationContent = successEl.querySelector(".notification-message");
        }
        if (!notificationContent) {
          notificationContent = successEl.querySelector("p");
        }
        if (!notificationContent) {
          notificationContent = successEl.querySelector("div");
        }
        
        if (notificationContent) {
          notificationContent.textContent = "Order restored successfully";
        } else {
          successEl.textContent = "Order restored successfully";
        }
      }
      
      if (successEl) {
        Toastify({
          node: successEl,
          duration: 5000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast();
      } else {
        alert("Order restored successfully");
      }

      // Refresh the order list
      fetchCampaignData(pagination.current_page);
      
      // Close modal and reset state
      setRestoreModalOpen(false);
      setOrderToRestore(null);
    } catch (error: any) {
      // Show error notification
      const errorEl = document
        .querySelectorAll("#failed-notification-content")[0]
        ?.cloneNode(true) as HTMLElement;
      
      if (errorEl) {
        errorEl.classList.remove("hidden");
        const notificationContent = errorEl.querySelector(".notification-content");
        if (notificationContent) {
          notificationContent.textContent = error.message || "Failed to restore order";
        }
      }
      
      if (errorEl) {
        Toastify({
          node: errorEl,
          duration: 5000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast();
      } else {
        alert(error.message || "Failed to restore order");
      }
    }
  };

  const handleForceDeleteConfirm = async () => {
    if (!orderToForceDelete) return;

    try {
      const response = await forceDeleteOrder(orderToForceDelete);
      
      // Show success notification
      const successEl = document
        .querySelectorAll("#success-notification-content")[0]
        ?.cloneNode(true) as HTMLElement;
      
      if (successEl) {
        successEl.classList.remove("hidden");
        
        // Try different selectors for the notification content
        let notificationContent = successEl.querySelector(".notification-content");
        if (!notificationContent) {
          notificationContent = successEl.querySelector(".notification-message");
        }
        if (!notificationContent) {
          notificationContent = successEl.querySelector("p");
        }
        if (!notificationContent) {
          notificationContent = successEl.querySelector("div");
        }
        
        if (notificationContent) {
          notificationContent.textContent = "Order permanently deleted";
        } else {
          successEl.textContent = "Order permanently deleted";
        }
      }
      
      if (successEl) {
        Toastify({
          node: successEl,
          duration: 5000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast();
      } else {
        alert("Order permanently deleted");
      }

      // Refresh the order list
      fetchCampaignData(pagination.current_page);
      
      // Close modal and reset state
      setForceDeleteModalOpen(false);
      setOrderToForceDelete(null);
    } catch (error: any) {
      // Show error notification
      const errorEl = document
        .querySelectorAll("#failed-notification-content")[0]
        ?.cloneNode(true) as HTMLElement;
      
      if (errorEl) {
        errorEl.classList.remove("hidden");
        const notificationContent = errorEl.querySelector(".notification-content");
        if (notificationContent) {
          notificationContent.textContent = error.message || "Failed to permanently delete order";
        }
      }
      
      if (errorEl) {
        Toastify({
          node: errorEl,
          duration: 5000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast();
      } else {
        alert(error.message || "Failed to permanently delete order");
      }
    }
  };

  const handleRestoreCancel = () => {
    setRestoreModalOpen(false);
    setOrderToRestore(null);
  };

  const handleForceDeleteCancel = () => {
    setForceDeleteModalOpen(false);
    setOrderToForceDelete(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (orderList.length === 0) {
    return (
      <div className="col-span-12 border rounded-2xl bg-white px-5 sm:px-6 intro-y">
        <div className="flex flex-col items-center justify-center py-12">
          <Lucide icon="Trash2" className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted orders</h3>
          <p className="text-gray-500 text-center">
            Deleted orders will appear here. You can restore them or permanently delete them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 border rounded-2xl bg-white px-5 sm:px-6 intro-y">
      <div className="grid grid-cols-12 text-slate-600">
        <div className="col-span-12 overflow-x-auto intro-y 2xl:overflow-visible">
          <Table className="border-spacing-y-[8px] border-separate min-w-full">
            <Table.Thead className="lg:h-10 text-slate-400">
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">Order ID</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">Campaign Name</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">Client</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">Amount</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">Deleted At</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap w-20">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {orderList.map((order, orderKey) => (
                <Table.Tr key={orderKey} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 !py-3">
                    <div className="flex items-center">
                      <div className="w-9 h-9 image-fit zoom-in">
                        <Lucide icon="FileText" className="w-4 h-4" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium whitespace-nowrap">
                          {order.order_id}
                        </div>
                      </div>
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3">
                    <div className="font-medium whitespace-nowrap">
                      {order.campaign_name}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3">
                    <div className="font-medium whitespace-nowrap">
                      {order.client_name}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3">
                    <div className="font-medium whitespace-nowrap">
                      {formatCurrency(order.discounted_total || order.total_order_amount)}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3">
                    <div className="text-slate-500 whitespace-nowrap">
                      {formatDate(order.deleted_at || '')}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3 w-20">
                    <div className="flex items-center">
                      <Menu className="relative">
                        <Menu.Button className="flex items-center justify-center w-5 h-5">
                          <Lucide icon="MoreVertical" className="w-4 h-4" />
                        </Menu.Button>
                        <Menu.Items className="w-40">
                          <Menu.Item>
                            <button
                              onClick={() => handleRestoreClick(order)}
                              className="flex items-center w-full p-2 text-left transition duration-300 ease-in-out rounded-md hover:bg-slate-100 focus:outline-none focus:bg-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
                            disabled={isRestoring}
                            type="button"
                            title="Restore Order"
                            >
                              <Lucide icon="RotateCcw" className="w-4 h-4 mr-2" />
                              Restore
                            </button>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              onClick={() => handleForceDeleteClick(order)}
                              className="flex items-center w-full p-2 text-left transition duration-300 ease-in-out rounded-md hover:bg-red-50 text-red-600 focus:outline-none focus:bg-red-50 disabled:bg-slate-50 disabled:text-slate-400"
                              disabled={isDeleting}
                              type="button"
                              title="Permanently Delete"
                            >
                              <Lucide icon="Trash2" className="w-4 h-4 mr-2" />
                              Force Delete
                            </button>
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        {/* Pagination */}
        <Pagination
          totalPages={pagination.last_page}
          currentPage={pagination.current_page}
          onPageChange={(page) => {
            setPagination((prev) => ({ ...prev, current_page: page }));
            fetchCampaignData(page);
          }}
          pagination={pagination}
          fetchData={fetchCampaignData}
        />
      </div>

      {/* Restore Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={restoreModalOpen}
        onClose={handleRestoreCancel}
        onConfirm={handleRestoreConfirm}
        title="Restore Order"
        message="Are you sure you want to restore this order? It will be moved back to its original status."
        itemName={orderToRestore ? `${orderToRestore.order_id} - ${orderToRestore.campaign_name}` : ""}
        isLoading={isRestoring}
        confirmButtonText="Restore Order"
        cancelButtonText="Cancel"
        type="info"
      />

      {/* Force Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={forceDeleteModalOpen}
        onClose={handleForceDeleteCancel}
        onConfirm={handleForceDeleteConfirm}
        title="Permanently Delete Order"
        message="Are you sure you want to permanently delete this order? This action cannot be undone and will remove all data associated with this order."
        itemName={orderToForceDelete ? `${orderToForceDelete.order_id} - ${orderToForceDelete.campaign_name}` : ""}
        isLoading={isDeleting}
        confirmButtonText="Permanently Delete"
        cancelButtonText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default DeletedOrdersSection;
