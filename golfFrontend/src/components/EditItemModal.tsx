import React, { useState } from "react";
import { useTerrains } from "./Context/TerrainsContext";
import { apiRequest } from "@/hooks/apiHookAsync";
import toast from "react-hot-toast";

type Item = {
  id: number;
  name: string;
  price?: number;          
  description?: string;
  inventory?: number;      
};

type Props = {
  item: Item;
  onClose: () => void;
  onUpdate: () => void;  
};

const EditItemModal = ({ item, onClose, onUpdate }: Props) => {
  const [name, setName]           = useState(item.name);
  const [price, setPrice]         = useState(item.price ?? 0);
  const [description, setDesc]    = useState(item.description ?? "");
  const [inventory, setInventory] = useState(item.inventory ?? 0);
  const [loading, setLoading]     = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const { refetch } = useTerrains();

  const handlePricechange = (value: number) => {
    setPrice(value);
    if (value <0) {
      setPriceError("Cijena mora biti pozitivan broj");
    } else {
      setPriceError(null);
    }
  };

  const handleSubmit = async () => {
    if (price < 0) {
      setPriceError("Cijena mora biti pozitivan broj");
      return;
    }

  setLoading(true);
  try {
    await apiRequest(`/services/${item.id}`, "PUT", {
      name,
      price: parseFloat(String(price)),
      inventory,
      description,
    });

    onClose();
    onUpdate();
    toast.success("Uspješno spremljeno");
    refetch();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Nepoznata greška";
    alert("Greška: " + msg);
  } finally {
    setLoading(false);
  }
};


  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Uredi stavku</h2>

      <label className="block">
        <span className="text-sm">Naziv</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-1"
        />
      </label>

      <label className="block">
        <span className="text-sm">Cijena (€)</span>
        <input
          type="number"
          step="0.10"
          value={price}
          onChange={(e) => handlePricechange(Number(e.target.value))}
          className={`mt-1 block w-full border rounded px-3 py-1 ${
            priceError ? "border-red-500" : ""
          }`}
        />
          {priceError && (
            <p className="text-red-500 text-sm mt-1">{priceError}</p>
          )}
      </label>

      <label className="block">
        <span className="text-sm">Opis</span>
        <textarea
          value={description}
          onChange={(e) => setDesc(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-1"
          rows={3}
        />
      </label>

      <label className="block">
        <span className="text-sm">Inventar (količina)</span>
        <input
          type="number"
          value={inventory}
          onChange={(e) => setInventory(Number(e.target.value))}
          className="mt-1 block w-full border rounded px-3 py-1"
        />
      </label>

      <div className="pt-3 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300">
          Odustani
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
        >
          Spremi
        </button>
      </div>
    </div>
  );
};

export default EditItemModal;
