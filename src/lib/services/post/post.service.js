"use server";

import { authFetch } from "../auth/auth.wrapper";


const BASE_URL = process.env.BACKEND_API_URL;

export const createPostAction = async ( postData ) =>
{
    try
    {
        const response = await authFetch( `${BASE_URL}/post/create`, {
            method: "POST",
            body: JSON.stringify( postData ),
            cache: "no-store",
        } );

        if ( !response )
        {
            return { success: false, message: "No response from server" };
        }

        const data = await response.json();

        console.log(postData)
        if ( !response.ok )
        {
            return {
                success: false,
                statusCode: response.status,
                message: data?.message || "Failed to create post",
            };
        }

        return {
            success: true,
            statusCode: response.status,
            data,
            message: "Post created successfully",
        };
    }
    catch ( error )
    {
        console.error( "Create Post Server Action Error:", error );

        return {
            success: false,
            statusCode: 500,
            message: error.message || "Something went wrong",
        };
    }
};

export const getUserPostsAction = async ( query = {} ) =>
{
    try
    {
        const queryParams = new URLSearchParams( query ).toString();

        const response = await authFetch(
            `${BASE_URL}/post/get-user-post${queryParams ? `?${queryParams}` : ""}`,
            {
                method: "GET",
                cache: "no-store",
            }
        );

        if ( !response )
        {
            return {
                success: false,
                message: "No response from server",
            };
        }

        const data = await response.json();

        console.log(data)

        if ( !response.ok )
        {
            return {
                success: false,
                statusCode: response.status,
                message: data?.message || "Failed to fetch posts",
            };
        }

        return {
            success: true,
            statusCode: response.status,
            data,
        };
    } catch ( error )
    {
        console.error( "Get User Posts Error:", error );

        return {
            success: false,
            statusCode: 500,
            message: error.message || "Something went wrong",
        };
    }
};

export const getAllPostsAction = async ( query = {} ) =>
{
    try
    {
        const page = Number( query.page ) || 1;
        const limit = Number( query.limit ) || 10;

        const url = new URL( `${BASE_URL}/post/get-all-post` );
        url.searchParams.set( "page", page.toString() );
        url.searchParams.set( "limit", limit.toString() );

        const response = await authFetch( url.toString(), {
            method: "GET",
            cache: "no-store",
        } );

        if ( !response )
        {
            return { success: false, message: "No response from server" };
        }

        const data = await response.json();

        if ( !response.ok )
        {
            return {
                success: false,
                statusCode: response.status,
                message: data?.message || "Failed to fetch posts",
            };
        }

        return {
            success: true,
            statusCode: response.status,
            data,
            message: "Posts fetched successfully",
        };
    }
    catch ( error )
    {
        console.error( "getAllPostsAction Error:", error );

        return {
            success: false,
            statusCode: 500,
            message: error.message || "Something went wrong",
        };
    }
};