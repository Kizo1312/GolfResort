import { useAuth } from "@/components/Context/AuthContext";
import { useFetchData } from "@/hooks/useFetchData";
import dayjs from "dayjs";

type Service = {
  name: string;
  price: number;
  category: string;
  description?: string;
};

type ReservationItem = {
  service_id: number;
  quantity: number;
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
  const { data, loading, error } = useFetchData<Reservation[]>(`/reservations/by-user/${user?.id}`);

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
                  {item.service.name} ({item.service.category}) – {item.quantity} × {item.service.price} € = {(item.quantity * item.service.price).toFixed(2)} €
                </li>
              ))}
            </ul>
          </div>
          <div className="font-semibold text-green-700 pt-2">
            Ukupno:{" "}
            {rez.reservation_items
              .reduce((sum, i) => sum + i.quantity * i.service.price, 0)
              .toFixed(2)}{" "}
            €
          </div>
        </div>
      ))}
    </div>
  );
};

export default MojeRezervacije;
