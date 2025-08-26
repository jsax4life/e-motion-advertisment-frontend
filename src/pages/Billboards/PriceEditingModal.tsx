import React, { useState, useEffect } from "react";
import { Dialog } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import { FormInput, FormLabel } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import LoadingIcon from "../../base-components/LoadingIcon";

interface PriceEditingModalProps {
  isOpen: boolean;
  billboard: any;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: { pricePerMonth: number; pricePerDay: number }) => void;
}

const PriceEditingModal: React.FC<PriceEditingModalProps> = ({
  isOpen,
  billboard,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    pricePerMonth: "",
    pricePerDay: "",
  });

  useEffect(() => {
    if (billboard) {
      setFormData({
        pricePerMonth: billboard.pricePerMonth?.toString() || "",
        pricePerDay: billboard.pricePerDay?.toString() || "",
      });
    }
  }, [billboard]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      pricePerMonth: Number(formData.pricePerMonth),
      pricePerDay: Number(formData.pricePerDay),
    });
  };

  const handleInputChange = (field: string, value: string) => {
    const numValue = Number(value) || 0;
    
    if (field === "pricePerMonth") {
      // Calculate price per day (monthly price ÷ 30 days)
      const calculatedPricePerDay = numValue / 30;
      setFormData(prev => ({
        ...prev,
        pricePerMonth: value,
        pricePerDay: calculatedPricePerDay.toFixed(2),
      }));
    } else if (field === "pricePerDay") {
      // Calculate price per month (daily price × 30 days)
      const calculatedPricePerMonth = numValue * 30;
      setFormData(prev => ({
        ...prev,
        pricePerMonth: calculatedPricePerMonth.toFixed(2),
        pricePerDay: value,
      }));
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Panel className="w-md max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Edit Billboard Pricing
        </Dialog.Title>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg">
            💡 <strong>Tip:</strong> When you change one price, the other will automatically calculate based on a 30-day month.
          </div>
          
          <div>
            <FormLabel htmlFor="pricePerMonth">Price Per Month (₦)</FormLabel>
            <FormInput
              id="pricePerMonth"
              type="number"
              placeholder="Enter price per month"
              value={formData.pricePerMonth}
              onChange={(e) => handleInputChange("pricePerMonth", e.target.value)}
              required
              min="0"
              step="0.01"
            />
            <div className="text-xs text-gray-500 mt-1">
              Daily price will be calculated as: Monthly Price ÷ 30
            </div>
          </div>

          <div>
            <FormLabel htmlFor="pricePerDay">Price Per Day (₦)</FormLabel>
            <FormInput
              id="pricePerDay"
              type="number"
              placeholder="Enter price per day"
              value={formData.pricePerDay}
              onChange={(e) => handleInputChange("pricePerDay", e.target.value)}
              required
              min="0"
              step="0.01"
            />
            <div className="text-xs text-gray-500 mt-1">
              Monthly price will be calculated as: Daily Price × 30
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-customColor text-white"
            >
              {isLoading ? (
                <>
                  <LoadingIcon icon="oval" className="w-4 h-4 mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Lucide icon="Save" className="w-4 h-4 mr-2" />
                  Update Price
                </>
              )}
            </Button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};

export default PriceEditingModal;
