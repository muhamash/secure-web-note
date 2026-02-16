"use server"

import httpStatus from "http-status-codes";


export const fetchInterest = async ()=>
{
    try {
        const response = await fetch(
            `${process.env.BACKEND_API_URL}/user/get-users-interests`
        );
        
       const data = await response.json();

        if ( response.status !== httpStatus.OK )
        {
            return {
                success: false,
                statusCode: response.status,
                message: data?.message || "Failed to fetch notes",
            };
        }

        return { success: true, data };
    }
    catch ( error )
    {
        console.error( "Server Action Error:", error );
        return {
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: error.message || "Something went wrong",
        };
    }
}

