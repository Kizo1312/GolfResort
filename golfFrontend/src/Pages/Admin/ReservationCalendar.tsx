import { useState } from "react";
import { Calendar, dateFnsLocalizer, Event, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { hr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

type Service = {
  name: string;
};

type ReservationItem = {
  quantity: number;
  service: Service;
};

type Reservation = {
  date: string;
  start_time: string;
  end_time: string;
  reservation_items: ReservationItem[];
};

type Props = {
  reservations: Reservation[];
};

const locales = { hr };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: hr }),
  getDay,
  locales,
});

const ReservationCalendar: React.FC<Props> = ({ reservations }) => {
  const [view, setView] = useState<View>("week");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const monthEvents: Event[] = reservations.map((res) => ({
    title: "",
    start: new Date(`${res.date}T00:00:00`),
    end: new Date(`${res.date}T23:59:59`),
    allDay: true,
  }));

  const detailedEvents: Event[] = reservations.map((r) => {
    const itemsStr = r.reservation_items
      .map((item) => `${item.service?.name} (${item.quantity}x)`)
      .join(", ");

    return {
      title: itemsStr,
      start: new Date(`${r.date}T${r.start_time}`),
      end: new Date(`${r.date}T${r.end_time}`),
      allDay: false,
      resource: r, // Pass full reservation
    };
  });

  const events = view === "month" ? monthEvents : detailedEvents;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Kalendar rezervacija</h3>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        view={view}
        onView={(newView) => setView(newView)}
        style={{ height: 600 }}
        step={15}
        timeslots={2}
        dayLayoutAlgorithm="no-overlap"
        eventPropGetter={() => ({
          style: {
            backgroundColor: "#e2e8f0", // neutral gray
            color: "#1e293b", // dark slate for contrast
            borderRadius: "6px",
            padding: "4px 6px",
            fontSize: "0.875rem",
            border: "none",
          },
        })}
        tooltipAccessor={(event) => String(event.title ?? "")}
        onSelectEvent={(event) => {
          if (view !== "month" && event.resource) {
            setSelectedReservation(event.resource);
          }
        }}
        messages={{
          next: "Sljedeći",
          previous: "Prethodni",
          today: "Danas",
          month: "Mjesec",
          week: "Tjedan",
          day: "Dan",
          agenda: "Agenda",
          date: "Datum",
          time: "Vrijeme",
          event: "Događaj",
          noEventsInRange: "Nema događaja u ovom rasponu.",
          showMore: (total) => `Broj rezervacija: ${total}`,
        }}
      />

      {/* Modal sa detaljima rezervacije */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h4 className="text-lg font-semibold mb-2">Detalji rezervacije</h4>
            <p className="text-sm text-gray-700 mb-1">
              📅 Datum: <strong>{selectedReservation.date}</strong>
            </p>
            <p className="text-sm text-gray-700 mb-1">
              🕒 Vrijeme: <strong>{selectedReservation.start_time} – {selectedReservation.end_time}</strong>
            </p>
            <p className="text-sm text-gray-700 mb-2">🔧 Usluge:</p>
            <ul className="text-sm text-gray-800 list-disc list-inside mb-4">
              {selectedReservation.reservation_items.map((item, idx) => (
                <li key={idx}>
                  {item.service?.name} ({item.quantity}x)
                </li>
              ))}
            </ul>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedReservation(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationCalendar;
