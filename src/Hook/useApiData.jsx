// src/hooks/useApi.js
import { useEffect } from "react";

export const useApiData = (apiFunction, setData, delay = 0) => {
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Aplicar el retraso antes de realizar la llamada a la API
        await new Promise((resolve) => setTimeout(resolve, delay));

        const response = await apiFunction();
        const data = await response.json();
        console.log(data)
        if (isMounted && data.success) {
          setData(data.data);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchData();

    // Cleanup: evita actualizaciones de estado si el componente se desmonta
    return () => {
      isMounted = false;
    };
  }, [apiFunction, setData, delay]);
};