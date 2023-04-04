import jwt_decode from "jwt-decode";

export interface JwtPayload {
  username: string;
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const decoded = jwt_decode(token) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}
