import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RezervacijaUspjeh = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Očisti history kako bi "back" vodio na početnu
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 bg-white shadow rounded text-center space-y-6">
      <h1 className="text-3xl font-bold text-green-700">✅ Rezervacija uspješna!</h1>
      <p className="text-lg text-gray-700">
        Potvrda rezervacije je poslana na vaš e-mail.
      </p>
      <button
        onClick={() => navigate("/moje-rezervacije")}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
      >
        Moje rezervacije
      </button>
    </div>
  );
};

export default RezervacijaUspjeh;
