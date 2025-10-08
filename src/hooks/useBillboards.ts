import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../stores/UserContext";
import API from "../utils/API";

interface BillboardFace {
  face_number: number;
  description: string | null;
}

interface Billboard {
  id: string;
  serialNumber: string;
  internalCode: string;
  billboardName: string;
  billboardType: "static" | "digital" | "bespoke" | "lamp_pole";
  numberOfSlotsOrFaces: number;
  pricePerDay: number;
  state: string;
  lga: string;
  address: string;
  geolocation: object;
  dimension: string;
  height: string;
  width: string;
  available_slots: number[];
  available_faces: BillboardFace[];
  available_lamp_holes: number[];
  pricePerMonth: string;
  status: string;
  activeStatus: string;
  images: [];
  orientation: string;
}

interface UseBillboardsReturn {
  availableBillboards: Billboard[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching all available billboards for order creation
 * This hook fetches the complete list without pagination
 */
export const useAvailableBillboards = (): UseBillboardsReturn => {
  const { user } = useContext(UserContext);
  const [availableBillboards, setAvailableBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableBillboards = () => {
    if (!user?.token) return;

    setLoading(true);
    setError(null);

    API(
      "get",
      "billboards/available", // Different endpoint for complete list
      { 
        status: "active", // Only fetch active billboards for orders
        per_page: 1000 // Large number to get all available billboards
      },
      function (response: any) {
        console.log(response)
        setAvailableBillboards(response.data.billboards || response.data.data || []);
        setLoading(false);
      },
      function (error: any) {
        console.error("Error fetching available billboards:", error);
        setError(error || "Failed to fetch available billboards");
        setLoading(false);
      },
      user.token
    );
  };

  useEffect(() => {
    fetchAvailableBillboards();
  }, [user?.token]);

  return {
    availableBillboards,
    loading,
    error,
    refetch: fetchAvailableBillboards,
  };
};

/**
 * Custom hook for fetching paginated billboards for billboard management
 */
export const usePaginatedBillboards = (page: number = 1, perPage: number = 10, filters: any = {}) => {
  const { user } = useContext(UserContext);
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const fetchBillboards = (currentPage: number = page) => {
    if (!user?.token) return;

    setLoading(true);
    setError(null);

    const params: any = {
      page: currentPage,
      per_page: perPage,
      ...filters,
    };

    API(
      "get",
      "billboard-data",
      params,
      function (response: any) {
        setBillboards(response.registered_billboards?.data || []);
        setPagination({
          current_page: response.registered_billboards?.current_page || 1,
          last_page: response.registered_billboards?.last_page || 1,
          per_page: response.registered_billboards?.per_page || 10,
          total: response.registered_billboards?.total || 0,
        });
        setLoading(false);
      },
      function (error: any) {
        console.error("Error fetching paginated billboards:", error);
        setError(error || "Failed to fetch billboards");
        setLoading(false);
      },
      user.token
    );
  };

  useEffect(() => {
    fetchBillboards(page);
  }, [user?.token, page, perPage, JSON.stringify(filters)]);

  return {
    billboards,
    loading,
    error,
    pagination,
    refetch: fetchBillboards,
  };
};
