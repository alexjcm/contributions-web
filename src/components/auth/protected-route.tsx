import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import { useAppContext } from "../../context/app-context";
import { buildSignInPath } from "../../lib/auth-navigation";
import { PageLoader } from "../ui/loaders";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn } = useAppContext();
  const location = useLocation();

  if (!isLoaded) {
    return <PageLoader label="Inicializando sesión..." />;
  }

  if (!isSignedIn) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={buildSignInPath(returnTo)} replace />;
  }

  return children;
};
