"use server";

export const loginUser = async ( email, password ) =>
{
    try
    {
        const response = await fetch(
            `${process.env.BACKEND_API_URL}/user/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( { email, password } ),
                cache: "no-store",
            }
        );

        // console.log( response )
        
        const data = await response.json();

        // console.log(data)

        if ( data.statusCode !== 200 )
        {
            throw new Error( data.message || "Login failed" );
        }

        return data;
    } catch ( error )
    {
        throw new Error( error.message || "Something went wrong" );
    }
};


export const registerUser = async ( payload ) =>
{
    try
    {
        const response = await fetch(
            `${process.env.BACKEND_API_URL}/user/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( payload ),
                cache: "no-store",
            }
        );

        console.log( "server action calling", response )
        
        const data = await response.json();

        

        if ( !response.ok )
        {
            throw new Error( data.message || "Registration failed" );
        }

        return data;
    } catch ( error )
    {
        console.log(error)
        throw error
    }
};