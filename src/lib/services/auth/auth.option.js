import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { generateTokens, verifyRefreshToken } from "./auth.jwt";
import { loginUser } from "./auth.service";


export const authOptions = {
    providers: [
        CredentialsProvider( {
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize ( credentials )
            {
                if ( !credentials?.email || !credentials?.password )
                {
                    throw new Error( "Email and password required" );
                }

                const response = await loginUser(
                    credentials.email,
                    credentials.password
                );

                console.log( response )
                
                if ( response?.statusCode !== 200 )
                {
                    throw new Error( "Invalid credentials" );
                }

                return {
                    id: response.data._id,
                    name: response.data.name,
                    email: response.data.email,
                    role: response.data.role,
                };
            },
        } ),
    ],

    session: { strategy: "jwt" },

    secret: process.env.AUTH_SECRET,

    jwt: { maxAge: 60 * 60 * 24 },

    callbacks: {
        async jwt ( { token, user } )
        {
            if ( user )
            {
                const { accessToken, refreshToken, accessTokenExpires } = generateTokens( user );

                return {
                    ...token,
                    ...user,
                    accessToken,
                    refreshToken,
                    accessTokenExpires,
                    rotated: true,
                };
            }

            const ROTATION_BUFFER = 45 * 1000;
            
            if ( Date.now() < ( token.accessTokenExpires  ) - ROTATION_BUFFER )
            {
                return { ...token, rotated: false };
            }

            const decoded = verifyRefreshToken( token.refreshToken  );

            if ( !decoded )
            {
                return { ...token, error: "RefreshTokenError", rotated: false };
            }

            const { accessToken, refreshToken, accessTokenExpires } = generateTokens( decoded  );

            console.log( "rotating tokens!!!" )
            
            return {
                ...token,
                accessToken,
                refreshToken,
                accessTokenExpires,
                rotated: true,
            };
        },

        async session ( { session, token } )
        {
            if ( token )
            {

                // role: token?.role 
                session.user = { id: token.id, email: token.email, name: token.name, role: token?.role };
                session.accessToken = token.accessToken;
                session.refreshToken = token.refreshToken;
                session.rotated = token.rotated;
            }

            console.log( " Session issued:", {
                user: session.user,
                rotated: session.rotated,
                expiresAt: new Date( token.accessTokenExpires ).toISOString(),
            } );

            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/error",
    },
};

export default NextAuth(authOptions);