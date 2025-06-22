import { useFetchData } from "@/hooks/useFetchData";
import ItemTable from "@/components/Admin/ItemTable";

type Item = {
  id: number;
  name: string;
  price: string;
  description: string;
};

const Tereni = () => {
  const { data, loading, error, refetch } = useFetchData<Item[]>("/services/golf teren");

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p>Greška: {error}</p>;
  if (!data) return <p>Nema podataka</p>;

   return <ItemTable items={data} onUpdate={refetch} />;
};

export default Tereni;
