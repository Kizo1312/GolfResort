
import { useFetchData } from "@/hooks/useFetchData";
import ReservationTable from "@/components/Admin/ReservationTable";

type ReservationItem = {
  service: {
    name: string;
    price: string;
  };
  quantity: number;
};

type Reservation = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  reservation_items: ReservationItem[];
};

const Reservations = () => {
  const { data, loading, error } = useFetchData<Reservation[]>("/reservations");

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p>Greška: {error}</p>;
  if (!data) return <p>Nema podataka</p>;

  return <ReservationTable items={data} />;
};

export default Reservations;
