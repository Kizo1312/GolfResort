import { useAuth } from "@/components/Context/AuthContext";
import { apiRequest } from "@/hooks/apiHookAsync";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/hr";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale("hr");

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
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await apiRequest<Reservation[]>(`/reservations/me`);
        setData(res);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Greška pri dohvatu rezervacija.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user]);

  const today = dayjs().startOf("day");

  const activeReservations = data
    ?.filter((rez) => dayjs(rez.date).isSameOrAfter(today))
    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

  const pastReservations = data
    ?.filter((rez) => dayjs(rez.date).isBefore(today))
    .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());

  if (!user) {
    return (
      <p className="text-center text-red-600">
        Morate biti prijavljeni da biste vidjeli rezervacije.
      </p>
    );
  }

  if (loading) return <p className="text-center">Učitavanje rezervacija...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!data || data.length === 0)
    return <p className="text-center">Nemate nijednu rezervaciju.</p>;

  const renderReservations = (reservations: Reservation[] | undefined) => {
    if (!reservations || reservations.length === 0) {
      return (
        <p className="text-center">
          {activeTab === "active"
            ? "Nemate aktivnih rezervacija."
            : "Nema prošlih rezervacija."}
        </p>
      );
    }
    return reservations.map((rez) => (
  <div key={rez.id} className="relative bg-white shadow rounded p-6 space-y-2 mb-6">
    
    {activeTab === "active" && (
      cancelingId === rez.id ? (
        <div className="absolute top-2 right-2 flex items-center space-x-2 text-gray-600 text-sm font-medium">
          <svg
            className="animate-spin h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>Otkazivanje u tijeku...</span>
        </div>
      ) : (
        <button
          onClick={() => {
            if (confirm("Jeste li sigurni da želite otkazati ovu rezervaciju?")) {
              cancelReservation(rez.id);
            }
          }}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-normal underline cursor-pointer"
          aria-label="Otkaži rezervaciju"
        >
          otkaži rezervaciju
        </button>
      )
    )}
        <p>
          <strong>Datum:</strong> {dayjs(rez.date).format("DD. MM. YYYY.")}
        </p>
        <p>
          <strong>Vrijeme:</strong> {rez.start_time} – {rez.end_time}
        </p>
        <div>
          <p className="font-medium">Usluge:</p>
          <ul className="list-disc list-inside text-sm">
            {rez.reservation_items.map((item, i) => (
              <li key={i}>
                {item.service.name} ({item.service.category}) – {item.quantity} ×{" "}
                {item.price_at_booking} € ={" "}
                {(item.quantity * item.price_at_booking).toFixed(2)} €
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
    ));
  };

const cancelReservation = async (id: number) => {
  setCancelingId(id);
  try {
    await apiRequest(`/reservations/${id}`, "DELETE");
    // nakon uspjeha, izbriši iz lokalnog state-a
    setData((prev) => prev ? prev.filter(r => r.id !== id) : null);
    alert("Rezervacija uspješno otkazana.");
  } catch (error: any) {
    alert(error.message || "Greška pri otkazivanju rezervacije.");
  } finally {
    setCancelingId(null);
  }
};

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center">Moje rezervacije</h2>

      {/* Tabovi */}
      <div className="flex justify-center space-x-4 mb-6">
         <button
          onClick={() => setActiveTab("past")}
          className={`px-4 py-2 rounded ${
            activeTab === "past"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Protekle
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 rounded ${
            activeTab === "active"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Aktivne
        </button>
      </div>

      {/* Prikaz rezervacija prema aktivnom tabu */}
      {activeTab === "active"
        ? renderReservations(activeReservations)
        : renderReservations(pastReservations)}
    </div>
  );
};

export default MojeRezervacije;


