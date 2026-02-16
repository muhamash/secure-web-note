import { getServerSession } from "next-auth";
import { getAuthToken } from "./auth.helper";
import { authOptions } from "./auth.option";

export const authFetch = async ( url, options = {} ) =>
{
    const session = await getServerSession( authOptions );
    let accessToken = await getAuthToken();

    if ( !accessToken || !session?.accessToken )
    {
        return {
            success: false,
            statusCode: 403,
            message: "Not authenticated",
        };
    }

    const makeRequest = async ( token ) =>
    {
        return fetch( url, {
            ...options,
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
                Cookie: `accessToken=${token}`, 
            },
        } );
    };

    let response = await makeRequest( accessToken );


    if ( response.status === 401 )
    {
        console.log( "Access token expired on backend. Forcing refresh..." );

        const newSession = await getServerSession( authOptions );

        if ( !newSession?.accessToken )
        {
            throw new Error( "Session expired" );
        }

      
        accessToken = newSession.accessToken;

        
        response = await makeRequest( accessToken );
    }

    return response;
};