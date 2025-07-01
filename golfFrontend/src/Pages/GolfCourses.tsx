import React, { useState, useEffect } from "react";
import { useFetchData } from "../hooks/useFetchData";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useReservation } from "@/components/Context/ReservationContext";

type GolfCourse = {
  id: number;
  name: string;
  description: string;
  images: string[];
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
      if (parsedId && golfCourses.some(c => c.id === parsedId)) {
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

  const selectedCourse = golfCourses.find(c => c.id === selectedId);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex overflow-x-auto border-b border-gray-300 mb-6">
        {golfCourses.map(course => (
          <button
            key={course.id}
            onClick={() => setSelectedId(course.id)}
            className={`whitespace-nowrap px-4 py-2 border-b-2 ${
              course.id === selectedId
                ? "border-green-600 text-green-600 font-bold"
                : "border-transparent text-gray-600"
            } hover:text-green-700`}
          >
            {course.name}
          </button>
        ))}
      </div>

      {selectedCourse && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-3xl font-semibold mb-4">{selectedCourse.name}</h2>
          <p className="mb-6 text-gray-700">{selectedCourse.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(selectedCourse.images && selectedCourse.images.length > 0
              ? selectedCourse.images.slice(0, 2)
              : [null, null]
            ).map((imgUrl, idx) =>
              imgUrl ? (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`${selectedCourse.name} image ${idx + 1}`}
                  className="rounded-lg object-cover w-full h-64"
                />
              ) : (
                <div
                  key={idx}
                  className="rounded-lg bg-gray-300 flex items-center justify-center w-full h-64 text-gray-500"
                >
                  No image available
                </div>
              )
            )}
          </div>

          <button
            onClick={() => {
              if (selectedCourse) {
                setReservationData({
                  category: "golf",
                  reservation_items: [{ service_id: selectedCourse.id, quantity: 1 }],
                });
                goToStep("category");
                navigate("/rezervacije");
              }
            }}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Reserve
          </button>
        </div>
      )}
    </div>
  );
};

export default GolfCourses;
