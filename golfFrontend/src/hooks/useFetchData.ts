import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export function useFetchData<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    console.log("VITE_API_BASE in useFetchData:", API_BASE);

    setLoading(true);
    fetch(`${API_BASE}${endpoint}`)
      .then((res) => {
        if (!res.ok) throw new Error("Greška prilikom dohvata podataka");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
}
