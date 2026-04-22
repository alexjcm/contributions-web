const rawAuth0Domain = (import.meta.env.VITE_AUTH0_DOMAIN ?? "").trim();
const rawAuth0ClientId = (import.meta.env.VITE_AUTH0_CLIENT_ID ?? "").trim();
const rawAuth0Audience = (import.meta.env.VITE_AUTH0_AUDIENCE ?? "").trim();

export const AUTH0_DOMAIN = rawAuth0Domain;
export const AUTH0_CLIENT_ID = rawAuth0ClientId;
export const AUTH0_AUDIENCE = rawAuth0Audience;

export const IS_AUTH_CONFIG_VALID = Boolean(
  AUTH0_DOMAIN && 
  AUTH0_CLIENT_ID && 
  AUTH0_AUDIENCE
);
