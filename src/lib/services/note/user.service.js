"use server";

import httpStatus from "http-status-codes";
import { getAuthToken } from "../auth/auth.helper";
import { authFetch } from "../auth/auth.wrapper";

const BASE_URL = process.env.BACKEND_API_URL;


export const fetchSingleUserNote = async (noteId) => {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      return {
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: "Not authenticated",
      };
    }

    const response = await authFetch(
      `${BASE_URL}/note/get-single-user-note/${noteId}`,
      {
        method: "GET",
        cache: "no-store",
        // headers: {
        //   Cookie: `accessToken=${accessToken}`,
        // },
        next: { tags: [`user-note`] },
      }
    );

    const data = await response.json();

    if (response.status !== httpStatus.OK) {
      return {
        success: false,
        statusCode: response.status,
        message: data?.message || "Failed to fetch note",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Server Action Error (fetchSingleUserNote):", error);
    return {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || "Something went wrong",
    };
  }
};


export const fetchUsersNotes = async ( userId, query = {} ) =>
{
    try
    {
        const accessToken = await getAuthToken();

        if ( !accessToken )
        {
            return {
                success: false,
                statusCode: httpStatus.FORBIDDEN,
                message: "Not authenticated",
            };
        }

        const queryParams = new URLSearchParams( query ).toString();

        const response = await authFetch(
            `${BASE_URL}/note/get-user-note/${userId}?${queryParams}`,
            {
                method: "GET",
                cache: "no-store",
                // headers: {
                //     Cookie: `accessToken=${accessToken}`,
                // },
                next: { tags: [ `user-notes-${userId}-${query.page}` ] },
            }
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
    } catch ( error )
    {
        console.error( "Server Action Error:", error );
        return {
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: error.message || "Something went wrong",
        };
    }
};


export const createUserNote = async ( userId, noteData ) =>
{
    try
    {
        const accessToken = await getAuthToken();
        if ( !accessToken )
        {
            return { success: false, statusCode: httpStatus.FORBIDDEN, message: "Not authenticated" };
        }

        const response = await authFetch( `${BASE_URL}/note/create-note`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Cookie: `accessToken=${accessToken}`,
            },
            body: JSON.stringify( { userId, ...noteData } ),
        } );

        const data = await response.json();

        if ( ![ httpStatus.OK, httpStatus.CREATED ].includes( response.status ) )
        {
            return { success: false, statusCode: response.status, message: data?.message || "Failed to create note" };
        }

        return { success: true, data };
    }
    catch ( error )
    {
        console.error( "Server Action Error (createUserNote):", error );
        return { success: false, statusCode: httpStatus.INTERNAL_SERVER_ERROR, message: error.message || "Something went wrong" };
    }
};


export const updateUserNote = async ( noteId, noteData) => {
  try {
    const accessToken = await getAuthToken();
    if (!accessToken) {
      return { success: false, statusCode: httpStatus.FORBIDDEN, message: "Not authenticated" };
    }
      
      console.log(noteData, noteId)

    const response = await authFetch(`${BASE_URL}/note/update-note/${noteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(noteData),
    });

    const data = await response.json();

    if (response.status !== httpStatus.OK) {
      return { success: false, statusCode: response.status, message: data?.message || "Failed to update note" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Server Action Error (updateUserNote):", error);
    return { success: false, statusCode: httpStatus.INTERNAL_SERVER_ERROR, message: error.message || "Something went wrong" };
  }
};


export const deleteUserNote = async (  noteId ) =>
{
    try
    {
        const accessToken = await getAuthToken();
        if ( !accessToken )
        {
            return { success: false, statusCode: httpStatus.FORBIDDEN, message: "Not authenticated" };
        }

        const response = await authFetch( `${BASE_URL}/note/delete-note/${noteId}`, {
            method: "DELETE",
            // headers: { Cookie: `accessToken=${accessToken}` },
        } );

        const data = await response.json();

        if ( response.status !== httpStatus.OK )
        {
            return { success: false, statusCode: response.status, message: data?.message || "Failed to delete note" };
        }

        return { success: true, data };
    } catch ( error )
    {
        console.error( "Server Action Error (deleteUserNote):", error );
        return { success: false, statusCode: httpStatus.INTERNAL_SERVER_ERROR, message: error.message || "Something went wrong" };
    }
};