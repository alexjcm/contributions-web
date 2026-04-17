import { useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { AUTH0_AUDIENCE } from "../config/auth";
import { getAuthErrorCode, AuthSessionError, isAuthSessionRecoveryError } from "../lib/auth-session";
import { ApiClient } from "../lib/http";

let inFlightAccessTokenPromise: Promise<string | null> | null = null;

export const useApiClient = (): ApiClient => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useMemo(() => {
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
              throw new AuthSessionError(undefined, getAuthErrorCode(error));
            }

            throw new AuthSessionError();
          } finally {
            inFlightAccessTokenPromise = null;
          }
        })();
      }

      return inFlightAccessTokenPromise;
    });
  }, [getAccessTokenSilently, isAuthenticated]);
};
