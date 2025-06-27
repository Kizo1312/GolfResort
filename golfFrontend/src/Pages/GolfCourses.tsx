import React, { useState, useEffect } from "react";
import { useFetchData } from "../hooks/useFetchData";
import { useNavigate } from "react-router-dom";

type GolfCourse = {
  id: number;
  name: string;
  description: string;
  images: string[];
};

const GolfCourses = () => {
  const navigate = useNavigate(); // <-- Add this here

  const { data: golfCourses, loading, error } = useFetchData<GolfCourse[]>("/services/golf teren");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (golfCourses && golfCourses.length > 0 && selectedId === null) {
      setSelectedId(golfCourses[0].id);
    }
  }, [golfCourses, selectedId]);

  if (loading) return <p>Loading golf courses...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!golfCourses || golfCourses.length === 0) return <p>No golf courses found.</p>;

  const selectedCourse = golfCourses.find(c => c.id === selectedId);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Horizontal scrollable bar */}
      <div className="flex overflow-x-auto border-b border-gray-300 mb-6">
        {golfCourses.map(course => (
          <button
            key={course.id}
            onClick={() => setSelectedId(course.id)}
            className={`whitespace-nowrap px-4 py-2 border-b-2 ${
              course.id === selectedId ? "border-green-600 text-green-600 font-bold" : "border-transparent text-gray-600"
            } hover:text-green-700`}
          >
            {course.name}
          </button>
        ))}
      </div>

      {/* Selected course details */}
      {selectedCourse && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-3xl font-semibold mb-4">{selectedCourse.name}</h2>
          <p className="mb-6 text-gray-700">{selectedCourse.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(selectedCourse.images && selectedCourse.images.length > 0
              ? selectedCourse.images.slice(0, 2)
              : [null, null]  // placeholders if no images
            ).map((imgUrl, idx) => (
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
            ))}
          </div>

          <button
            onClick={() => navigate("/rezervacije")}
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
