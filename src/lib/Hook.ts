import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";


interface StateData {
  name: string;
  lgas: string[];
}



function useTimeout(callback: () => void, delay: number) {
  const callbackRef = useRef(callback);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);



  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
  }, [delay]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { reset, clear };
}

// Debounce Hook
export function useDebounce(callback: () => void, delay: number, dependencies: any[]) {
  const { reset, clear } = useTimeout(callback, delay);
  useEffect(reset, [...dependencies, reset]);
  useEffect(clear, [clear]);
}




export const useFetchStates = () => {
  const [states, setStates] = useState<StateData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch("https://nigerian-states-and-lga.vercel.app/");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: StateData[] = await response.json();
        setStates(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  return { states, loading, error };
};

// export default useFetchStates;



