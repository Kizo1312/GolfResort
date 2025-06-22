import React, { useState } from "react";

type Item = {
  id: number;
  name: string;
  price?: number;          // promijenjeno na number
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/services/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseFloat(String(price)), // broj
          inventory,                        // novi ključ
          description,                      // po želji (backend mora podržati)
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      onClose();
      onUpdate();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Nepoznata greška";
      alert("Greška: " + msg);
    } finally {
      setLoading(false);
    }
  };

  /* ------- UI ------- */
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
          step="0.01"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mt-1 block w-full border rounded px-3 py-1"
        />
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
