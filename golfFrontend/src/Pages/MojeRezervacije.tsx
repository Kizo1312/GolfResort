import { useAuth } from "@/components/Context/AuthContext";
import { useFetchData } from "@/hooks/useFetchData";
import dayjs from "dayjs";
import { apiRequest } from "@/hooks/apiHookAsync";
import { useState } from "react";
import { useEffect } from "react";

type Service = {
  name: string;
  price: number;
  category: string;
  description?: string;
};

type ReservationItem = {
  service_id: number;
  quantity: number;
  price_at_booking: number;
  service: Service;
};

type Reservation = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  reservation_items: ReservationItem[];
};

const MojeRezervacije = () => {
  const { user } = useAuth();
  const [data, setData] = useState<Reservation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await apiRequest<Reservation[]>(`/reservations/by-user/${user.id}`);
      setData(res);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Greška pri dohvatu rezervacija.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user]);





  if (!user) {
    return <p className="text-center text-red-600">Morate biti prijavljeni da biste vidjeli rezervacije.</p>;
  }

  if (loading) return <p className="text-center">Učitavanje rezervacija...</p>;
  if (error) return <p className="text-center text-red-600">Greška: {error}</p>;
  if (!data || data.length === 0) return <p className="text-center">Nemate nijednu rezervaciju.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center">Moje rezervacije</h2>

      {data.map((rez) => (
        <div key={rez.id} className="bg-white shadow rounded p-6 space-y-2">
          <p><strong>Datum:</strong> {rez.date}</p>
          <p><strong>Vrijeme:</strong> {rez.start_time} – {rez.end_time}</p>
          <div>
            <p className="font-medium">Usluge:</p>
            <ul className="list-disc list-inside text-sm">
              {rez.reservation_items.map((item, i) => (
                <li key={i}>
                  {item.service.name} ({item.service.category}) – {item.quantity} × {item.price_at_booking} € = {(item.quantity * item.price_at_booking).toFixed(2)} €
                </li>
              ))}
            </ul>
          </div>
          <div className="font-semibold text-green-700 pt-2">
            Ukupno:{" "}
            {rez.reservation_items
              .reduce((sum, i) => sum + i.quantity * i.price_at_booking, 0)
              .toFixed(2)}{" "}
            €
          </div>
        </div>
      ))}
    </div>
  );
};

export default MojeRezervacije;
