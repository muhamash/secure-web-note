import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET; 

export function generateTokens(user) {
    const payload = { id: user.id, email: user.email, name: user.name, role: user.role };

    const accessToken = jwt.sign( payload, ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE } );
    const refreshToken = jwt.sign( payload, REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE } );

    return { accessToken, refreshToken, accessTokenExpires: Date.now() + 3 * 60 * 1000 };
};

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch {
    return null;
  }
}