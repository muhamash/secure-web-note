"use server";

import { authFetch } from "../auth/auth.wrapper";

const BASE_URL = process.env.BACKEND_API_URL;

export const fetchUsersAction = async ( page = 1, limit = 10 ) =>
{
    try
    {
        page = Number( page ) || 1;
        limit = Number( limit ) || 10;

        const url = new URL( `${BASE_URL}/admin/all-users` );
        url.searchParams.set( 'page', page );
        url.searchParams.set( 'limit', limit );

        const response = await authFetch( url.toString(), {
            method: 'GET',
            cache: 'no-store',
            
        } );

        const data = await response.json();

        if ( !response.ok )
        {
            return {
                success: false,
                statusCode: response.status,
                message: data?.message || 'Failed to fetch users',
            };
        }

        return {
            success: true,
            statusCode: response.status,
            data: data?.data,
            message: data.message || 'Users fetched successfully',
        };
    }
    catch ( error )
    {
        console.error( 'Fetch Users Server Action Error:', error );
        return {
            success: false,
            statusCode: 500,
            message: error.message || 'Something went wrong',
        };
    }
};

export const deleteUserAction = async ( userId ) =>
{
    if ( !userId ) return { success: false, message: "User ID is required" };

    try
    {
        const response = await authFetch( `${BASE_URL}/admin/${userId}`, {
            method: "DELETE",
            cache: "no-store",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        } );

        const data = await response.json();

        if ( !response.ok )
        {
            return {
                success: false,
                statusCode: response.status,
                message: data?.message || "Failed to delete user",
            };
        }

        return {
            success: true,
            statusCode: response.status,
            message: data?.message || "User deleted successfully",
        };
    } catch ( error )
    {
        console.error( "Delete User Server Action Error:", error );
        return { success: false, statusCode: 500, message: error.message || "Something went wrong" };
    }
};

export const blockUserAction = async ( userId, block = true ) =>
{
    if ( !userId ) return { success: false, message: "User ID is required" };

    try
    {
        const response = await authFetch( `${BASE_URL}/admin/${userId}/block`, {
            method: "PATCH",
            cache: "no-store",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( { block } ), 
        } );

        const data = await response.json();

        if ( !response.ok )
        {
            return {
                success: false,
                statusCode: response.status,
                message: data?.message || "Failed to update user block status",
            };
        }

        return {
            success: true,
            statusCode: response.status,
            message: data?.message || ( block ? "User blocked" : "User unblocked" ),
        };
    } catch ( error )
    {
        console.error( "Block User Server Action Error:", error );
        return { success: false, statusCode: 500, message: error.message || "Something went wrong" };
    }
};