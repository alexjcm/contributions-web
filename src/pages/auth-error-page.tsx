import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { LogIn, ArrowLeft, Mail, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";

export const AuthErrorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract Auth0 error details from URL for internal tracing
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const state = searchParams.get("state");

  useEffect(() => {
    if (error || errorDescription) {
      console.group("🔐 Auth0 Error Trace");
      console.error("Error:", error);
      console.error("Description:", errorDescription);
      console.info("State:", state);
      console.groupEnd();
    }
  }, [error, errorDescription, state]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6 sm:p-8 animate-in fade-in duration-700 bg-[#0f172a]">
      {/* Background Decorative Elements - Sophisticated "Midpoint" Vibe */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5%] top-[-5%] h-[40%] w-[40%] rounded-full bg-primary-900/20 blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] h-[40%] w-[40%] rounded-full bg-primary-600/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[480px]">
        <div className="overflow-hidden rounded-[var(--radius-dialog)] border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-10 shadow-2xl ring-1 ring-white/10 sm:px-10 sm:py-12">
          
          {/* Header & Logo Section */}
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-8 transition-transform hover:scale-105 duration-500">
              <img 
                src="https://contrib-dcm.pages.dev/logo-base.png" 
                alt="DCM Logo" 
                className="h-16 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              />
            </div>
            
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-danger-500/10 text-danger-400 mb-4 ring-1 ring-danger-500/20">
              <AlertCircle size={24} />
            </div>
            
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              No pudimos completar el inicio de sesión
            </h1>
            <p className="mt-4 text-base font-medium leading-relaxed text-neutral-400">
              Hubo un problema al procesar tu acceso a <span className="text-primary-400 font-bold">DCM • Gestión de Aportes Familiares.</span>
            </p>
          </div>

          {/* Support Section */}
          <div className="mb-10 rounded-2xl border border-white/5 bg-white/[0.03] p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-neutral-300">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold leading-relaxed text-neutral-300">
                  Intenta nuevamente. Si el problema persiste, contáctese con soporte en:
                </p>
                <a 
                  href="mailto:alex.test.jcm@gmail.com" 
                  className="mt-2 inline-block text-sm font-bold text-primary-400 hover:text-primary-300 transition-colors"
                >
                  alex.test.jcm@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/sign-in")}
              className="h-14 w-full text-base font-black shadow-lg shadow-primary-900/20"
              icon={LogIn}
            >
              Ir a iniciar sesión
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate("/contributions")}
              className="h-14 w-full border-white/10 bg-transparent text-neutral-300 hover:bg-white/5 hover:text-white"
              icon={ArrowLeft}
            >
              Volver al inicio
            </Button>
          </div>

          {/* Footer Decoration */}
          <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600">
            DCM Security Protocol
          </p>
        </div>
      </div>
    </main>
  );
};
