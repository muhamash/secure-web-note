"use server"

import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export const getAuthToken = async () =>
{
    const isProduction = process.env.NODE_ENV === "production";
    const COOKIES_NAME = isProduction
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token";

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get( COOKIES_NAME )?.value;

    if ( !sessionCookie ) return null;

    const decodedSession = ( await decode( {
        secret: process.env.AUTH_SECRET,
        token: sessionCookie,
    } ) );

    return decodedSession?.accessToken ?? null;
};