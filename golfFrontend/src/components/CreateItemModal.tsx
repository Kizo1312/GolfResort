import React, { useState } from "react";
import { apiRequest } from "@/hooks/apiHookAsync";
import { useModal } from "./Context/ModalContext";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

type Props = {
  onUpdate: () => void;
};

const CreateItemModal = ({ onUpdate }: Props) => {
  const { close } = useModal();

  const location = useLocation();
  const path = location.pathname;

  const inferredCategory = path.includes("wellness")
    ? "wellness"
    : path.includes("dodatne") || path.includes("dodatna")
    ? "dodatna usluga"
    : "";

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: inferredCategory,
    inventory: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.category === "golf teren") {
      toast.error("Ne možete dodati teren ovdje.");
      return;
    }

    try {
      await apiRequest("/services", "POST", {
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        category: form.category,
        inventory: parseInt(form.inventory),
      });

      toast.success("Usluga uspješno dodana!");
      onUpdate();
      close();
    } catch (error) {
      console.error("Error creating item:", error);
      return;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dodaj novu uslugu</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Naziv</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full rounded"
          />
          {!form.name && (
            <div className="text-red-500 text-sm mt-1">Naziv je obavezan</div>
          )}
        </div>

        <div>
          <label className="block mb-1">Cijena (€)</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border p-2 w-full rounded"
          />
          {!form.price && (
            <div className="text-red-500 text-sm mt-1">Cijena je obavezna</div>
          )}
        </div>

        <div>
          <label className="block mb-1">Opis</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Kategorija</label>
          <div className="p-2 w-full border rounded bg-gray-100 text-gray-700">
            {form.category || "Nepoznata kategorija"}
          </div>
        </div>
        <div>
          <label className="block mb-1">Inventar</label>
          <input
            type="number"
            min="0"
            value={form.inventory}
            onChange={(e) => setForm({ ...form, inventory: e.target.value })}
            className="border p-2 w-full rounded"
            placeholder="Broj dostupnih komada"
          />
          {!form.inventory && (
            <div className="text-red-500 text-sm mt-1">
              Količina je obavezna
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={close}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Odustani
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Dodaj
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItemModal;
