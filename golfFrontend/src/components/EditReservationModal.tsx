import { apiRequest } from "@/hooks/apiHookAsync";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

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
  const [startTime, setStartTime] = useState(
    reservation.start_time.slice(0, 5)
  );
  const [duration, setDuration] = useState(reservation.duration_minutes);
  const [busyRanges, setBusyRanges] = useState<
    { start: string; end: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const mainServiceId =
    reservation.reservation_items?.[0]?.service?.id ||
    reservation.reservation_items?.[0]?.service_id;

  const timeOptions: string[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeOptions.push(hour.toString().padStart(2, "0") + ":00");
  }

  const addMinutes = (timeStr: string, mins: number): string => {
    const [h, m, s] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m + mins, s || 0, 0);
    return date.toTimeString().slice(0, 8);
  };

  const availableTimeOptions = useMemo(() => {
    const now = new Date();
    const isToday = date === now.toISOString().split("T")[0];
    const closingTime = "20:00:00";

    return timeOptions.filter((time) => {
      const proposedStart = time.length === 5 ? `${time}:00` : time;
      const proposedEnd = addMinutes(proposedStart, duration);

      if (isToday) {
        const [hour, minute] = proposedStart.split(":").map(Number);
        if (
          hour < now.getHours() ||
          (hour === now.getHours() && minute <= now.getMinutes())
        ) {
          return false;
        }
      }

      if (proposedEnd > closingTime) {
        return false;
      }

      const overlaps = busyRanges.some((range) => {
        return proposedStart < range.end && proposedEnd > range.start;
      });

      return !overlaps;
    });
  }, [timeOptions, busyRanges, duration, date]);

  useEffect(() => {
    if (!availableTimeOptions.includes(startTime)) {
      setStartTime(availableTimeOptions[0] || "");
    }
  }, [availableTimeOptions]);

  useEffect(() => {
    if (isOpen) {
      setDate(reservation.date);
      setStartTime(reservation.start_time.slice(0, 5));
      setDuration(reservation.duration_minutes);
    }
  }, [isOpen, reservation]);

  useEffect(() => {
    if (!mainServiceId || !date) return;

    const fetchAvailability = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/availability/${date}/${mainServiceId}`
        );

        if (!res.ok) {
          if (res.status === 404) {
            setBusyRanges([]);
            return;
          }
          throw new Error("Greška u dohvatu dostupnosti");
        }

        let busy = await res.json();

        const currentStart =
          reservation.start_time.length === 5
            ? `${reservation.start_time}:00`
            : reservation.start_time;

        const [h, m, s] = currentStart.split(":").map(Number);
        const endDate = new Date();
        endDate.setHours(h, m + reservation.duration_minutes, s || 0, 0);
        const currentEnd = endDate.toTimeString().slice(0, 5); // HH:MM

        busy = busy.filter(
          (range: any) =>
            !(
              range.start === currentStart.slice(0, 5) &&
              range.end === currentEnd
            )
        );

        setBusyRanges(busy);
      } catch (err) {
        console.error("Greška pri dohvaćanju dostupnosti:", err);
        setBusyRanges([]);
      }
    };

    fetchAvailability();
  }, [date, mainServiceId, reservation]);

  const handleSubmit = async () => {
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

    try {
      const response = await toast.promise(
        apiRequest(
          `/reservations/${reservation.id}`,
          "PUT",
          updatedReservation
        ),
        {
          loading: "Spremanje...",
          success: "Rezervacija uspješno ažurirana!",
          error: (err) => err.message || "Greška: nešto nije u redu.",
        }
      );

      onUpdate(response);
      onClose();
    } catch (err) {
      // Error toast is already shown by toast.promise
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
              {availableTimeOptions.length === 0 ? (
                <option disabled>Nema slobodnih termina</option>
              ) : (
                availableTimeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))
              )}
            </select>
          </label>

          {reservation.reservation_items?.[0]?.service?.category !==
            "wellness" && (
            <label className="block">
              Trajanje (min):
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="border rounded p-2 w-full"
              >
                {[60, 120, 180, 240].map((val) => (
                  <option key={val} value={val}>
                    {val} minuta
                  </option>
                ))}
              </select>
            </label>
          )}
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
