import React, { useState } from "react";
import { apiRequest } from "@/hooks/apiHookAsync";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
  onUpdate: (updated: any) => void;
};

const EditReservationModal = ({
  isOpen,
  onClose,
  reservation,
  onUpdate,
}: Props) => {
  const [date, setDate] = useState(reservation.date);
  const [startTime, setStartTime] = useState(reservation.start_time);
  const [duration, setDuration] = useState(reservation.duration_minutes);
  const timeOptions = [];
  for (let hour = 8; hour <= 20; hour++) {
    const hourStr = hour.toString().padStart(2, "0") + ":00";
    timeOptions.push(hourStr);
  }

  const handleSubmit = async () => {
    try {
      const formattedStartTime =
        startTime.length === 5 ? `${startTime}:00` : startTime;

      const updatedReservation = {
        user_id: reservation.user_id,
        date,
        start_time: formattedStartTime,
        duration_minutes: duration,
        reservation_items: reservation.reservation_items.map((item: any) => ({
          service_id: item.service?.id || item.service_id,
          quantity: item.quantity,
        })),
      };

      const res = await apiRequest(
        `/reservations/${reservation.id}`,
        "PUT",
        updatedReservation
      );

      onUpdate(res);
      onClose();
      alert("Rezervacija uspješno ažurirana!");
    } catch (err: any) {
      alert("Greška: " + (err.message || "Neuspješna promjena rezervacije."));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-[400px] space-y-4">
        <h2 className="text-xl font-semibold">Uredi Rezervaciju</h2>

        <div className="space-y-2">
          <label className="block">
            Datum:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </label>

          <label className="block">
            Početak:
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded p-2 w-full"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            Trajanje (min):
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="border rounded p-2 w-full"
            />
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Odustani
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Spremi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReservationModal;
