import { useAuth } from "@/components/Context/AuthContext";
import { apiRequest } from "@/hooks/apiHookAsync";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/hr";
import { toast } from "react-hot-toast";

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
  duration_minutes: number;
  end_time: string;
  reservation_items: ReservationItem[];
};

const MojeRezervacije = () => {
  const { user } = useAuth();
  const [data, setData] = useState<Reservation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [reservationToCancel, setReservationToCancel] =
    useState<Reservation | null>(null);

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

  const paginate = (items: Reservation[] | undefined) => {
    if (!items) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const cancelReservation = async (id: number) => {
    setCancelingId(id);
    try {
      await apiRequest(`/reservations/${id}`, "DELETE");
      setData((prev) => (prev ? prev.filter((r) => r.id !== id) : null));
      toast.success("Rezervacija je uspješno otkazana!", {
        duration: 4000,
        style: {
          background: "#2E7D32",
          color: "white",
          fontWeight: "500",
        },
      });
    } catch (error: any) {
      alert(error.message || "Greška pri otkazivanju rezervacije.");
    } finally {
      setCancelingId(null);
    }
  };

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
      <div
        key={rez.id}
        className="relative bg-white shadow rounded p-6 space-y-2 mb-6"
      >
        {activeTab === "active" &&
          (cancelingId === rez.id ? (
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
                setReservationToCancel(rez);
                setShowConfirmCancel(true);
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-normal underline cursor-pointer"
              aria-label="Otkaži rezervaciju"
            >
              otkaži rezervaciju
            </button>
          ))}

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
                {item.service.name} ({item.service.category}) – {item.quantity}{" "}
                × {item.price_at_booking} € ={" "}
                {item.service.category === "golf teren"
                  ? (
                      item.price_at_booking *
                      (rez.duration_minutes / 60)
                    ).toFixed(2)
                  : (item.quantity * item.price_at_booking).toFixed(2)}{" "}
                €
              </li>
            ))}
          </ul>
        </div>
        <div className="font-semibold text-green-700 pt-2">
          Ukupno:{" "}
          {rez.reservation_items
            .reduce((sum, item) => {
              if (item.service.category === "golf teren") {
                return (
                  sum + item.price_at_booking * (rez.duration_minutes / 60)
                );
              } else if (item.service.category === "wellness") {
                return sum + item.quantity * item.price_at_booking;
              }
              return (
                sum +
                item.quantity *
                  item.price_at_booking *
                  (rez.duration_minutes / 60)
              );
            }, 0)
            .toFixed(2)}{" "}
          €
        </div>
      </div>
    ));
  };

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

  const selectedReservations =
    activeTab === "active" ? activeReservations : pastReservations;
  const paginatedReservations = paginate(selectedReservations);
  const totalPages = Math.ceil(
    (selectedReservations?.length || 0) / itemsPerPage
  );

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

      {showConfirmCancel && reservationToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <p className="mb-4 text-gray-800">
              Jeste li sigurni da želite otkazati ovu rezervaciju za{" "}
              <strong>
                {dayjs(reservationToCancel.date).format("DD. MM. YYYY.")}
              </strong>{" "}
              u <strong>{reservationToCancel.start_time}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowConfirmCancel(false);
                  setReservationToCancel(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Odustani
              </button>
              <button
                onClick={() => {
                  setShowConfirmCancel(false);
                  if (reservationToCancel) {
                    cancelReservation(reservationToCancel.id);
                  }
                  setReservationToCancel(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Otkaži rezervaciju
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prikaz rezervacija */}
      {renderReservations(paginatedReservations)}

      {/* Paginacija */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-300 disabled:opacity-50"
          >
            ← Prethodna
          </button>
          <span className="px-4 py-2">
            Stranica {currentPage} od {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-300 disabled:opacity-50"
          >
            Sljedeća →
          </button>
        </div>
      )}
    </div>
  );
};

export default MojeRezervacije;
