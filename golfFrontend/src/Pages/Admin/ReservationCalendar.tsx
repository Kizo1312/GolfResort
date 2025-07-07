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
  const [view, setView] = useState<View>("month");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const groupedByDate: { [date: string]: number } = {};

  reservations.forEach(res => {
    groupedByDate[res.date] = (groupedByDate[res.date] || 0) + 1;
  });

  const monthEvents: Event[] = Object.entries(groupedByDate).map(([date, count]) => ({
    title: `Broj rezervacija: ${count}`,
    start: new Date(`${date}T00:00:00`),
    end: new Date(`${date}T23:59:59`),
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

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
        date={selectedDate}
        onNavigate={(date) => setSelectedDate(date)}
        onView={(newView) => setView(newView)}
        onSelectSlot={({start}) => {
          if (view === "month" && start instanceof Date) {
            setSelectedDate(start);
            setView("day");
          }
        }}
        onSelectEvent={(event) => {
          if (view === "month" && event?.start) {
            setSelectedDate(event.start);
            setView("day");
          } else if (event.resource) {
            setSelectedReservation(event.resource);
          }
        }}
        style={{ height: 600 }}
        step={15}
        timeslots={2}
        min={new Date(1970, 1, 1, 8, 0)}
        max={new Date(1970, 1, 1, 20, 0)}
        dayLayoutAlgorithm="no-overlap"
        eventPropGetter={() => ({
          style: {
            backgroundColor: "#5882a7", 
            color: "#ffffff", 
            borderRadius: "6px",
            padding: "4px 6px",
            fontSize: "0.875rem",
            border: "none",
          },
        })}
        tooltipAccessor={(event) => String(event.title ?? "")}
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
