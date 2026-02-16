
export const validateForm = ( formData, setErrors, rules ) =>
{
    const newErrors = {};

    for ( const field in rules )
    {
        const value = formData[ field ];
        const fieldRules = rules[ field ];

        for ( const rule of fieldRules )
        {
            if ( !rule.validate( value, formData ) )
            {
                newErrors[ field ] = rule.message;
                break; 
            }
        }
    }

    setErrors( newErrors );
    return Object.keys( newErrors ).length === 0;
};