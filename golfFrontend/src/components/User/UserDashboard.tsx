import { useState } from "react";
import MojProfil from "./MojProfil";
import MojeRezervacije from "../../Pages/MojeRezervacije";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "reservations">("reservations");

  return (
    <div className="flex max-w-5xl mx-auto mt-10 shadow rounded overflow-hidden">
      <aside className="w-48 bg-gray-100 p-4">
        <nav className="flex flex-col space-y-2">
         <button
            onClick={() => setActiveTab("reservations")}
            className={`p-2 rounded text-left w-full ${
              activeTab === "reservations" ? "bg-blue-500 text-white" : "hover:bg-blue-100"
            }`}
          >
            Moje rezervacije
          </button>
          <button
             onClick={() => setActiveTab("profile")}
            className={`p-2 rounded text-left w-full ${
              activeTab === "profile" ? "bg-blue-500 text-white" : "hover:bg-blue-100"
            }`}
          >
            Moj profil
          </button>
        </nav>
      </aside>

      <main className="flex-grow bg-white p-6">
        {activeTab === "profile" && <MojProfil />}
        {activeTab === "reservations" && <MojeRezervacije />}
      </main>
    </div>
  );
};

export default UserDashboard;


