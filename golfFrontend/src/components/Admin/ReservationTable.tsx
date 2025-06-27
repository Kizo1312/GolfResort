import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { apiRequest } from "@/hooks/apiHookAsync";


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

type Props = {
  items: Reservation[];
};

const ReservationTable = ({ items }: Props) => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [filtered, setFiltered] = useState<Reservation[]>([]);

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

      <div className="grid grid-cols-5 font-semibold text-gray-700 px-6 py-3 border-b">
        <span>ID</span>
        <span>Datum</span>
        <span>Vrijeme</span>
        <span>Usluge</span>
        <span>Akcije</span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-600 px-6">Nema rezervacija za ovaj dan.</p>
      ) : (
        <ul>
          {filtered.map((res) => (
            <li
              key={res.id}
              className="grid grid-cols-5 items-start px-6 py-4 border-b text-sm hover:bg-gray-50"
            >
              <span>{res.id}</span>
              <span>{res.date}</span>
              <span>
                {res.start_time} - {res.end_time}
              </span>
              <span>
                <ul className="list-disc list-inside">
                  {res.reservation_items.map((item, i) => (
                    <li key={i}>
                      {item.service.name} ({item.quantity}× {item.service.price} €)
                    </li>
                  ))}
                </ul>
              </span>
              <span>
                <button
                  onClick={() => deleteReservation(res.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Obriši
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationTable;