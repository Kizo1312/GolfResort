import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { apiRequest } from "@/hooks/apiHookAsync";
import EditReservationModal from "../EditReservationModal";

type ReservationItem = {
  service_id: number;
  quantity: number;
  service?: {
    id: number;
    name: string;
    price: string;
  };
};

type Reservation = {
  id: number;
  user_id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  reservation_items: ReservationItem[];
};

type Props = {
  items: Reservation[];
};

const ReservationTable = ({ items }: Props) => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [filtered, setFiltered] = useState<Reservation[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const openEditModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsEditOpen(true);
  };

  const handleUpdate = (updated: Reservation) => {
    setFiltered((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
    );
  };

  useEffect(() => {
    const filter = items.filter((r) => r.date === selectedDate);
    setFiltered(filter);
  }, [items, selectedDate]);

  const deleteReservation = async (id: number) => {
    const confirm = window.confirm("Jeste li sigurni da želite obrisati ovu rezervaciju?");
    if (!confirm) return;

    try {
      await apiRequest(`/reservations/${id}`, "DELETE");
      setFiltered((prev) => prev.filter((r) => r.id !== id));
      alert("Rezervacija uspješno obrisana.");
    } catch (err: any) {
      alert("Greška: " + (err.message || "Neuspješno brisanje."));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Rezervacije za dan</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      {/* Header */}
      <div className="grid grid-cols-[60px_1fr_1fr_2fr_100px] gap-4 px-6 py-3 border-b font-semibold text-gray-700">
        <span>ID</span>
        <span>Datum</span>
        <span>Vrijeme</span>
        <span>Usluge</span>
        <span className="text-right">Akcije</span>
      </div>

      {/* Rezervacije */}
      {filtered.length === 0 ? (
        <p className="text-gray-600 px-6">Nema rezervacija za ovaj dan.</p>
      ) : (
        <ul>
          {filtered.map((res) => (
            <li
              key={res.id}
              className="grid grid-cols-[60px_1fr_1fr_2fr_100px] gap-4 items-start px-6 py-4 border-b text-sm hover:bg-gray-50"
            >
              <span>{res.id}</span>
              <span>{res.date}</span>
              <span>
                {res.start_time} - {res.end_time}
              </span>
              <span>
                <ul className="list-disc list-inside space-y-1">
                  {res.reservation_items.map((item, i) => (
                    <li key={i}>
                      {item.service?.name || "Nepoznata usluga"} ({item.quantity} × {item.service?.price} €)
                    </li>
                  ))}
                </ul>
              </span>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => deleteReservation(res.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Obriši
                </button>
                <button
                  onClick={() => openEditModal(res)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Promijeni
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isEditOpen && selectedReservation && (
        <EditReservationModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          reservation={selectedReservation}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ReservationTable;
