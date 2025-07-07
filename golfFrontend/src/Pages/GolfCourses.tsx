import React, { useState, useEffect } from "react";
import { useFetchData } from "../hooks/useFetchData";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useReservation } from "@/components/Context/ReservationContext";

import photo1 from "@/assets/tereni/1-photo.webp";
import photo2 from "@/assets/tereni/2-photo.webp";
import photo3 from "@/assets/tereni/3-photo.webp";
import photo4 from "@/assets/tereni/4-photo.webp";
import photo5 from "@/assets/tereni/5-photo.webp";
import photo6 from "@/assets/tereni/6-photo.webp";
import photo7 from "@/assets/tereni/7-photo.webp";
import photo8 from "@/assets/tereni/8-photo.webp";

const imageMap: Record<number, { photo: string }> = {
  1: { photo: photo1 },
  2: { photo: photo2 },
  3: { photo: photo3 },
  4: { photo: photo4 },
  5: { photo: photo5 },
  6: { photo: photo6 },
  7: { photo: photo7 },
  8: { photo: photo8 },
};

type GolfCourse = {
  id: number;
  name: string;
  description: string;
};

const GolfCourses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setReservationData, goToStep } = useReservation();

  const { data: golfCourses, loading, error } = useFetchData<GolfCourse[]>("/services/golf teren");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const selectedFromUrl = searchParams.get("selectedId");
    const parsedId = selectedFromUrl ? parseInt(selectedFromUrl) : null;

    if (golfCourses && golfCourses.length > 0) {
      if (parsedId && golfCourses.some((c) => c.id === parsedId)) {
        setSelectedId(parsedId);
      } else if (selectedId === null) {
        setSelectedId(golfCourses[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [golfCourses]);

  if (loading) return <p>Loading golf courses...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!golfCourses || golfCourses.length === 0) return <p>No golf courses found.</p>;

  const selectedCourse = golfCourses.find((c) => c.id === selectedId);
  const sortedCourses =golfCourses.sort((a,b) => a.id - b.id )

  return (
    <div className="max-w-7xl mx-auto mt-10 shadow rounded overflow-hidden min-h-[600px]">

      {/* Mobile dropdown navigation */}
        <div className="md:hidden p-4 bg-gray-100">
          <select
            value={selectedId ?? ""}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {sortedCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-[320px] flex-none bg-gray-100 p-6 overflow-y-auto">
          <nav className="flex flex-col space-y-2">
            {golfCourses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedId(course.id)}
                className={`p-3 rounded text-left w-full truncate ${
                  course.id === selectedId
                    ? "bg-green-600 text-white font-semibold"
                    : "hover:bg-green-200 text-gray-700"
                }`}
              >
                {course.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-grow bg-white p-8 flex flex-col">
          {selectedCourse ? (
            <>
              <h2 className="text-3xl font-semibold mb-4">{selectedCourse.name}</h2>
              <div className="flex justify-center mb-8">
                {imageMap[selectedCourse.id]?.photo ? (
                  <img
                    src={imageMap[selectedCourse.id].photo}
                    alt={`${selectedCourse.name} photo`}
                    className="rounded-lg object-cover max-h-[400px] w-auto"
                  />
                ) : (
                  <div className="rounded-lg bg-gray-300 w-full max-w-lg h-[400px] flex items-center justify-center text-gray-500">
                    No photo available
                  </div>
                )}
              </div>
              <p className="mb-6 text-gray-700">{selectedCourse.description}</p>

              <div className="mt-auto flex justify-end">
                <button
                  onClick={() => {
                    setReservationData({
                      category: "golf",
                      reservation_items: [{ service_id: selectedCourse.id, quantity: 1 }],
                    });
                    goToStep("category");
                    navigate("/rezervacije");
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
                >
                  Rezerviraj
                </button>
              </div>
            </>
          ) : (
            <p>Odaberite teren sa liste.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default GolfCourses;
