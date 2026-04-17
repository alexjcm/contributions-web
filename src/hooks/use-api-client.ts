import { useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router";

import { AUTH0_AUDIENCE } from "../config/auth";
import { buildSignInPath } from "../lib/auth-navigation";
import { getAuthErrorCode, AuthSessionError, isAuthSessionRecoveryError } from "../lib/auth-session";
import { ApiClient } from "../lib/http";

let inFlightAccessTokenPromise: Promise<string | null> | null = null;
let authRecoveryNavigationInFlight = false;

export const useApiClient = (): ApiClient => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  return useMemo(() => {
    const redirectToSessionRecovery = () => {
      if (authRecoveryNavigationInFlight) {
        return;
      }

      authRecoveryNavigationInFlight = true;

      const returnTo = `${location.pathname}${location.search}${location.hash}`;
      navigate(buildSignInPath(returnTo, "session-expired"), { replace: true });

      window.setTimeout(() => {
        authRecoveryNavigationInFlight = false;
      }, 0);
    };

    return new ApiClient(async () => {
      if (!isAuthenticated) {
        return null;
      }

      if (!inFlightAccessTokenPromise) {
        inFlightAccessTokenPromise = (async () => {
          try {
            const token = await getAccessTokenSilently({
              authorizationParams: {
                audience: AUTH0_AUDIENCE
              }
            });

            return token ?? null;
          } catch (error) {
            console.warn("No se pudo obtener access token de Auth0 para la API.", error);

            if (isAuthSessionRecoveryError(error)) {
              redirectToSessionRecovery();
              throw new AuthSessionError(undefined, getAuthErrorCode(error));
            }

            throw new AuthSessionError();
          } finally {
            inFlightAccessTokenPromise = null;
          }
        })();
      }

      return inFlightAccessTokenPromise;
    }, redirectToSessionRecovery);
  }, [getAccessTokenSilently, isAuthenticated, location.hash, location.pathname, location.search, navigate]);
};
