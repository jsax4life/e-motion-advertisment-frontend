import React from "react";
import { Dialog } from "@headlessui/react";
import Button from "./Button";
import Lucide from "./Lucide";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  type?: "danger" | "warning" | "info";
  showForceDelete?: boolean;
  onForceDelete?: () => void;
  isForceDeleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  type = "danger",
  showForceDelete = false,
  onForceDelete,
  isForceDeleting = false
}) => {
  const getIconAndColors = () => {
    switch (type) {
      case "warning":
        return {
          icon: "AlertTriangle" as const,
          iconColor: "text-yellow-600",
          iconBgColor: "bg-yellow-100",
          confirmButtonColor: "bg-yellow-600 hover:bg-yellow-700"
        };
      case "info":
        return {
          icon: "Info" as const,
          iconColor: "text-blue-600",
          iconBgColor: "bg-blue-100",
          confirmButtonColor: "bg-blue-600 hover:bg-blue-700"
        };
      default: // danger
        return {
          icon: "AlertCircle" as const,
          iconColor: "text-red-600",
          iconBgColor: "bg-red-100",
          confirmButtonColor: "bg-red-600 hover:bg-red-700"
        };
    }
  };

  const { icon, iconColor, iconBgColor, confirmButtonColor } = getIconAndColors();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
              <Lucide icon={icon} className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {title}
              </Dialog.Title>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {message}
            </p>
            {itemName && (
              <p className="text-sm font-medium text-gray-900 mt-2">
                "{itemName}"
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline-secondary"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading || isForceDeleting}
            >
              {cancelButtonText}
            </Button>
            <Button
              className={`flex-1 text-white ${confirmButtonColor} disabled:opacity-50`}
              onClick={onConfirm}
              disabled={isLoading || isForceDeleting}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </div>
              ) : (
                confirmButtonText
              )}
            </Button>
            {showForceDelete && onForceDelete && (
              <Button
                className="flex-1 text-white bg-red-800 hover:bg-red-900 disabled:opacity-50"
                onClick={onForceDelete}
                disabled={isLoading || isForceDeleting}
              >
                {isForceDeleting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Force Deleting...
                  </div>
                ) : (
                  "Force Delete"
                )}
              </Button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
