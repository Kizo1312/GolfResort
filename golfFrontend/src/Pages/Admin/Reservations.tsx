import { useEffect, useState } from "react";
import ReservationTable from "@/components/Admin/ReservationTable";
import { apiRequest } from "@/hooks/apiHookAsync";

type Service = {
  id: number;
  name: string;
  price: string;
  category: string;
};

type ReservationItem = {
  id?: number;
  service_id: number;
  service?: Service;
  quantity: number;
  price_at_booking?: number;
};

type Reservation = {
  id: number;
  user_id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  reservation_items: ReservationItem[];
  created_at?: string;
};


const Reservations = () => {
  const [data, setData] = useState<Reservation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<Reservation[]>("/reservations");
      setData(res);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Greška prilikom dohvata rezervacija.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p>Greška: {error}</p>;
  if (!data) return <p>Nema podataka</p>;

  return <ReservationTable items={data} />;
};

export default Reservations;
