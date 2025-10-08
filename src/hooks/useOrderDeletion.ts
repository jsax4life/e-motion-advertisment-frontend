import { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../stores/UserContext';
import API from '../utils/API';

interface Order {
  id: number;
  order_id: string;
  campaign_name: string;
  status: string;
  total_order_amount: number;
  discounted_total: number;
  deleted_at?: string | null;
}

interface DeletionResponse {
  message: string;
  data: {
    order_id: number;
    campaign_name: string;
    deleted_at: string;
    billboards_unbooked: number;
  };
}

interface UseOrderDeletionReturn {
  isDeleting: boolean;
  isRestoring: boolean;
  deleteOrder: (order: Order) => Promise<DeletionResponse>;
  forceDeleteOrder: (order: Order) => Promise<DeletionResponse>;
  restoreOrder: (order: Order) => Promise<DeletionResponse>;
  canDeleteOrder: (order: Order) => { canDelete: boolean; reason?: string };
  canForceDeleteOrder: (order: Order) => { canDelete: boolean; reason?: string };
  canRestoreOrder: (order: Order) => { canRestore: boolean; reason?: string };
}

export const useOrderDeletion = (): UseOrderDeletionReturn => {
  const { user } = useContext(UserContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Business rules for order deletion
  const canDeleteOrder = (order: Order): { canDelete: boolean; reason?: string } => {
    // Orders that cannot be soft deleted
    const nonDeletableStatuses = ['delivered', 'paid', 'cancelled'];
    
    if (nonDeletableStatuses.includes(order.status.toLowerCase())) {
      return {
        canDelete: false,
        reason: `Cannot delete orders with status "${order.status}". Only pending and approved orders can be deleted.`
      };
    }

    // Check if order is already deleted
    if (order.deleted_at) {
      return {
        canDelete: false,
        reason: "This order has already been deleted."
      };
    }

    // Note: Backend will validate if order is within active campaign period
    // Frontend validation here would require campaign date comparison
    // The backend error "Cannot delete active campaign orders" will be handled in the UI
    
    return { canDelete: true };
  };

  const canForceDeleteOrder = (order: Order): { canDelete: boolean; reason?: string } => {
    // Force delete requires the order to be soft deleted first
    if (!order.deleted_at) {
      return {
        canDelete: false,
        reason: "Order must be soft deleted before force deletion. Use regular delete first."
      };
    }

    // Check if order is already permanently deleted (shouldn't happen, but safety check)
    if (order.deleted_at && order.status === 'permanently_deleted') {
      return {
        canDelete: false,
        reason: "Order is already permanently deleted"
      };
    }
    
    return { canDelete: true };
  };

  const canRestoreOrder = (order: Order): { canRestore: boolean; reason?: string } => {
    // Only soft-deleted orders can be restored
    if (!order.deleted_at) {
      return {
        canRestore: false,
        reason: "This order is not deleted and cannot be restored."
      };
    }
    
    return { canRestore: true };
  };

  const deleteOrder = async (order: Order): Promise<DeletionResponse> => {
    // Check if order can be deleted
    const { canDelete, reason } = canDeleteOrder(order);
    if (!canDelete) {
      throw new Error(reason);
    }

    setIsDeleting(true);
    
    try {
      return new Promise((resolve, reject) => {
        API(
          'delete',
          `campaign-orders/${order.id}`,
          {
            deleted_by: user?.id,
            deleted_at: new Date().toISOString(),
            reason: 'User initiated soft deletion'
          },
          (response: DeletionResponse) => {
            console.log('Order soft deleted successfully:', response);
            console.log('Setting isDeleting to false in success callback');
            setIsDeleting(false);
            resolve(response);
          },
          (error: any) => {
            console.error('Error soft deleting order:', error);
            setIsDeleting(false);
            reject(new Error(error || 'Failed to delete order'));
          },
          user?.token
        );
      });
    } catch (error) {
      setIsDeleting(false);
      throw error;
    }
  };

  const forceDeleteOrder = async (order: Order): Promise<DeletionResponse> => {
    // Check if order can be force deleted
    const { canDelete, reason } = canForceDeleteOrder(order);
    if (!canDelete) {
      throw new Error(reason);
    }

    setIsDeleting(true);
    
    try {
      return new Promise((resolve, reject) => {
        API(
          'delete',
          `campaign-orders/${order.id}/force`,
          {
            deleted_by: user?.id,
            deleted_at: new Date().toISOString(),
            reason: 'User initiated permanent deletion'
          },
          (response: DeletionResponse) => {
            console.log('Order permanently deleted successfully:', response);
            setIsDeleting(false);
            resolve(response);
          },
          (error: any) => {
            console.error('Error permanently deleting order:', error);
            setIsDeleting(false);
            reject(new Error(error || 'Failed to permanently delete order'));
          },
          user?.token
        );
      });
    } catch (error) {
      setIsDeleting(false);
      throw error;
    }
  };

  const restoreOrder = async (order: Order): Promise<DeletionResponse> => {
    // Check if order can be restored
    const { canRestore, reason } = canRestoreOrder(order);
    if (!canRestore) {
      throw new Error(reason);
    }

    setIsRestoring(true);
    
    try {
      return new Promise((resolve, reject) => {
        API(
          'post',
          `campaign-orders/${order.id}/restore`,
          {
            restored_by: user?.id,
            restored_at: new Date().toISOString(),
            reason: 'User initiated restoration'
          },
          (response: DeletionResponse) => {
            console.log('Order restored successfully:', response);
            setIsRestoring(false);
            resolve(response);
          },
          (error: any) => {
            console.error('Error restoring order:', error);
            setIsRestoring(false);
            reject(new Error(error || 'Failed to restore order'));
          },
          user?.token
        );
      });
    } catch (error) {
      setIsRestoring(false);
      throw error;
    }
  };

  return {
    isDeleting,
    isRestoring,
    deleteOrder,
    forceDeleteOrder,
    restoreOrder,
    canDeleteOrder,
    canForceDeleteOrder,
    canRestoreOrder
  };
};
