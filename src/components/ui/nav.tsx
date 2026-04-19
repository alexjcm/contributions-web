import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router";
import { 
  LayoutDashboard, 
  CalendarDays, 
  ReceiptText, 
  Settings2, 
  LogOut,
  UserCircle
} from "lucide-react";

import { APP_PERMISSIONS } from "../../config/permissions";
import { useAppContext } from "../../context/app-context";
import { Button } from "./button";

export const AppNav = () => {
  const { logout } = useAuth0();
  const { userEmail, hasPermission, contributionRestrictionMessage } = useAppContext();
  const canManageSettings = hasPermission(APP_PERMISSIONS.settingsWrite);

  const navLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return `flex shrink-0 items-center gap-1 px-2.5 py-2 text-[13px] font-semibold transition-all rounded-lg sm:gap-2 sm:px-3 sm:text-sm md:px-4 ${
      isActive 
        ? "border border-primary-700 bg-primary-600 !text-white shadow-[0_8px_18px_rgba(37,99,235,0.18)] [&_svg]:!text-white" 
        : "text-primary-900/84 hover:bg-primary-50 hover:text-primary-900 [&_svg]:text-primary-500"
    }`;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,249,252,0.9))] backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-[1.75rem] font-bold leading-none text-slate-900 sm:text-[2rem]">Aportes Familiares</h1>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-primary-600">
              Portal DCM
            </span>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <div className="flex items-center gap-2 rounded-full border border-primary-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
              <UserCircle size={16} className="text-primary-600" />
              <span className="max-w-[150px] truncate">{userEmail ?? "Usuario"}</span>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              icon={LogOut} 
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              Salir
            </Button>
          </div>

          <div className="flex lg:hidden">
            <Button
              variant="outline"
              size="sm"
              icon={LogOut}
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              aria-label="Salir"
            >
              Salir
            </Button>
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto pb-4 pr-4 whitespace-nowrap scrollbar-hide sm:flex-wrap sm:gap-2 sm:overflow-visible sm:pr-0 sm:whitespace-normal">
          <NavLink to="/contributions" className={navLinkClass}>
            <ReceiptText size={16} className="sm:h-[18px] sm:w-[18px]" />
            Registro
          </NavLink>
          <NavLink to="/annual" className={navLinkClass}>
            <CalendarDays size={16} className="sm:h-[18px] sm:w-[18px]" />
            Seguimiento
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            <LayoutDashboard size={16} className="sm:h-[18px] sm:w-[18px]" />
            Dashboard
          </NavLink>
          {canManageSettings && (
            <NavLink to="/settings" className={navLinkClass}>
              <Settings2 size={16} className="sm:h-[18px] sm:w-[18px]" />
              Ajustes
            </NavLink>
          )}
        </nav>

        {contributionRestrictionMessage && (
          <div className="mb-4">
            <div className="flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50/80 px-3 py-2 text-xs font-medium text-primary-900 shadow-sm animate-in fade-in slide-in-from-top-1">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary-500"></span>
              {contributionRestrictionMessage}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
