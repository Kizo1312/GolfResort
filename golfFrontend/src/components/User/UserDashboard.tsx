import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MojProfil from "./MojProfil";
import MojeRezervacije from "../../Pages/MojeRezervacije";

const UserDashboard = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as "profile" | "reservations") ?? "reservations";
  const [activeTab, setActiveTab] = useState<"profile" | "reservations">(initialTab);

  // Kad se search param promijeni (npr. korisnik klikne link u meniju), ažuriraj tab
  useEffect(() => {
    const newTab = searchParams.get("tab") as "profile" | "reservations";
    if (newTab && newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [searchParams]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      {/* Mobile dropdown meni */}
      <div className="md:hidden mb-6">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as "profile" | "reservations")}
          className="w-full p-2 border rounded"
        >
          <option value="reservations">Moje rezervacije</option>
          <option value="profile">Moj profil</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row shadow rounded overflow-hidden">
        {/* Sidebar samo za desktop */}
        <aside className="hidden md:block w-48 bg-gray-100 p-4">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => setActiveTab("reservations")}
              className={`p-2 rounded text-left w-full ${
                activeTab === "reservations"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-100"
              }`}
            >
              Moje rezervacije
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`p-2 rounded text-left w-full ${
                activeTab === "profile"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-100"
              }`}
            >
              Moj profil
            </button>
          </nav>
        </aside>

        {/* Glavni sadržaj */}
        <main className="flex-grow bg-white p-6">
          {activeTab === "profile" && <MojProfil />}
          {activeTab === "reservations" && <MojeRezervacije />}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
