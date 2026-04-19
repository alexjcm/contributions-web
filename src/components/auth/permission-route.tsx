import type { ReactNode } from "react";

import type { AppPermission } from "../../config/permissions";
import { useAppContext } from "../../context/app-context";
import { SectionLoader } from "../ui/loaders";

export const PermissionRoute = ({ required, children }: { required: AppPermission; children: ReactNode }) => {
  const { permissionsLoaded, hasPermission } = useAppContext();

  if (!permissionsLoaded) {
    return <SectionLoader label="Cargando permisos..." />;
  }

  if (!hasPermission(required)) {
    return (
      <section className="rounded-xl border border-warning-300 bg-warning-50 p-4 text-sm font-medium text-warning-900">
        No tienes permisos para acceder a esta sección.
      </section>

    );
  }

  return children;
};
