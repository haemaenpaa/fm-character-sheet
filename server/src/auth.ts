import { UserInfoClient } from "auth0";
import { AuthOptions, auth } from "express-oauth2-jwt-bearer";

const authParams: AuthOptions = {
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_SIGNING_ALG || "RS256",
};
const checkJwt = process.env.AUTH0_BASE_URL ? auth(authParams) : undefined;

export const userInfoClient = process.env.AUTH0_AUTHORITY
  ? new UserInfoClient({
      domain: process.env.AUTH0_AUTHORITY,
    })
  : undefined;

export default checkJwt;
