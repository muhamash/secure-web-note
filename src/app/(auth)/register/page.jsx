'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { INTEREST_OPTIONS } from '@/lib/constants';
import { USER_ROLES } from '@/lib/constants/user.enums';
import { registerUser } from '@/lib/services/auth/auth.service';
import { validateForm } from '@/lib/services/auth/auth.validation';
import { Lock, Mail, NotebookIcon, Shield, User, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();

    const [ formData, setFormData ] = useState( {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: USER_ROLES.USER,
        interests: [],
    } );

    const [ errors, setErrors ] = useState( {} );

    const handleSubmit = async ( e ) =>
    {
        e.preventDefault();
        
        const rules = {
            name: [
                { validate: ( v ) => v?.trim() !== "", message: "Name is required" }
            ],
            email: [
                { validate: ( v ) => v?.trim() !== "", message: "Email is required" },
                { validate: ( v ) => /\S+@\S+\.\S+/.test( v ), message: "Invalid email format" }
            ],
            password: [
                { validate: ( v ) => v?.length >= 6, message: "Password must be at least 6 characters" }
            ],
            confirmPassword: [
                { validate: ( v, data ) => v === data.password, message: "Passwords do not match" }
            ],
            interests: [
                {
                    validate: ( v ) => Array.isArray( v ) && v.length > 0,
                    message: "Please select at least one interest"
                }
            ]
        };

        // Validate form
        if ( !validateForm( formData, setErrors, rules ) ) return;

        const newUser = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            password: formData.confirmPassword,
            interests: formData.interests,
        };

        try
        {
            const registeredUser = await registerUser( newUser );

            console.log( "User registered successfully:", registeredUser );

            if ( registeredUser?.error ||  registeredUser?.statusCode !== 201)
            {
                toast.error( registeredUser.error );
                return;
            }

            if ( registeredUser?.statusCode === 201 )
            {
                toast.success( "Registered successful" );
                router.push( "/login" );
            }
            
             
        }
        catch ( error )
        {
            console.error( "Registration failed:", error.message );
            toast.error( error?.message || "Failed to login!" );
            setErrors( { apiError: error.message } );
        }
    };

    const handleInputChange = ( field, value ) =>
    {
        setFormData( { ...formData, [ field ]: value } );
    };
    
    const handleInterestToggle = ( interest ) =>
    {
        setFormData( ( prev ) =>
        {
            const exists = prev.interests.includes( interest );

            if ( exists )
            {
                return {
                    ...prev,
                    interests: prev.interests.filter( ( i ) => i !== interest ),
                };
            } else
            {
                return {
                    ...prev,
                    interests: [ ...prev.interests, interest ],
                };
            }
        } );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-900 p-4">
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

            <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
                            <NotebookIcon className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-base">
                        Join us to start taking secure notes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={ handleSubmit } className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={ formData.name }
                                    onChange={ ( e ) => handleInputChange( 'name', e.target.value ) }
                                    className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500"
                                />
                            </div>
                            { errors.name && (
                                <p className="text-sm text-red-500">{ errors.name }</p>
                            ) }
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={ formData.email }
                                    onChange={ ( e ) => handleInputChange( 'email', e.target.value ) }
                                    className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500"
                                />
                            </div>
                            { errors.email && (
                                <p className="text-sm text-red-500">{ errors.email }</p>
                            ) }
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                                <Select value={ formData.role } onValueChange={ ( value ) => handleInputChange( 'role', value ) }>
                                    <SelectTrigger className="pl-10 h-11 border-slate-300 dark:border-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ USER_ROLES.USER }>
                                            <div className="flex items-center">
                                                <UserCircle className="mr-2 h-4 w-4" />
                                                User
                                            </div>
                                        </SelectItem>
                                        <SelectItem value={ USER_ROLES.ADMIN }>
                                            <div className="flex items-center">
                                                <Shield className="mr-2 h-4 w-4" />
                                                Admin
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={ formData.password }
                                    onChange={ ( e ) => handleInputChange( 'password', e.target.value ) }
                                    className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500"
                                />
                            </div>
                            { errors.password && (
                                <p className="text-sm text-red-500">{ errors.password }</p>
                            ) }
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={ formData.confirmPassword }
                                    onChange={ ( e ) => handleInputChange( 'confirmPassword', e.target.value ) }
                                    className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500"
                                />
                            </div>
                            { errors.confirmPassword && (
                                <p className="text-sm text-red-500">{ errors.confirmPassword }</p>
                            ) }
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Interests</Label>

                            <div className="flex flex-wrap gap-2">
                                { INTEREST_OPTIONS.map( ( interest ) =>
                                {
                                    const isSelected = formData.interests.includes( interest );

                                    return (
                                        <button
                                            type="button"
                                            key={ interest }
                                            onClick={ () => handleInterestToggle( interest ) }
                                            className={ `px-3 py-1 rounded-full text-sm border transition-all
            ${isSelected
                                                    ? "bg-emerald-600 text-white border-emerald-600"
                                                    : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                                                }
          `}
                                        >
                                            { interest }
                                        </button>
                                    );
                                } ) }
                            </div>
                            { errors.interests && (
                                <p className="text-sm text-red-500">{ errors.interests }</p>
                            ) }
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-500/30 transition-all duration-200"
                        >
                            <User className="mr-2 h-4 w-4" />
                            Create Account
                        </Button>

                        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                            Already have an account?{ ' ' }
                            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}