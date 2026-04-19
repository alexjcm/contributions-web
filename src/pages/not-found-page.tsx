import { useNavigate } from "react-router";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "../components/ui/button";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6 animate-in fade-in duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-danger-50 text-danger-600 shadow-inner mb-8">
        <AlertCircle size={40} />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-neutral-700 mb-1">Ruta no encontrada</h2>
      <p className="text-sm text-neutral-500 font-medium mb-8 text-center max-w-xs">
        La página que buscas no existe o ha sido movida a otra ubicación.
      </p>

      <Button 
        icon={Home} 
        onClick={() => navigate("/summary")}
      >
        Volver al Resumen
      </Button>
    </main>
  );
};

