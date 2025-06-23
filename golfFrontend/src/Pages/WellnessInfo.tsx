import React from "react";
import { useNavigate } from "react-router-dom";

const WellnessInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Slika */}
        <div className="w-full md:w-1/2">
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Slika wellness centra
          </div>
        </div>

        {/* Tekstualni dio */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Wellness Centar</h2>
            <p className="text-gray-700 mb-4">
              Opuštanje za dušu i tijelo. Naši tretmani i sauna garantiraju potpuno resetiranje.
            </p>
            <p className="text-lg font-semibold text-green-600 mb-4">Cijena od 60€ / sat</p>
          </div>

          <button
            onClick={() => navigate("/rezervacije")}
            className="self-start bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Rezerviraj
          </button>
        </div>
      </div>
    </div>
  );
};

export default WellnessInfo;
