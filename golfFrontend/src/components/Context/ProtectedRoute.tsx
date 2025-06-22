import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
};

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, isLoading } = useAuth();

  // ⏳ Čekamo da se context završi učitavati prije bilo kakve provjere
  if (isLoading) {
    // možeš umjesto null vratiti loader: <div>Loading...</div>
    return null;
  }

  // ❌ Nije prijavljen
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Nema dozvoljenu rolu
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // ✅ Sve ok, prikaži sadržaj
  return <>{children}</>;
};

export default ProtectedRoute;
