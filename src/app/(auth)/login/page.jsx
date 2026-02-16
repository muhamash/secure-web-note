'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateForm } from '@/lib/services/auth/auth.validation';
import { Lock, LogIn, Mail, NotebookTabs } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ errors, setErrors ] = useState( {} );

    const handleSubmit = async ( e ) =>
    {
        e.preventDefault();
        const formData = { email, password };

        const rules = {
            email: [
                { validate: v => !!v, message: "Email is required" },
                { validate: v => /\S+@\S+\.\S+/.test( v ), message: "Email is invalid" },
            ],
            password: [
                { validate: v => !!v, message: "Password is required" },
                { validate: v => v.length >= 6, message: "Password must be at least 6 characters" },
            ],
        };

        if ( !validateForm( formData, setErrors, rules ) ) return;

        console.log( email, password )
        
        try
        {
            const res = await signIn( "credentials", {
                email,
                password,
                redirect: false,
            } );

            console.log( res )
            
            if ( res?.error )
            {
                toast.error( res.error );
                return;
            }

            if ( res?.ok )
            {
                toast.success( "Login successful" );
                router.push( "/" );
            }
        } catch ( error )
        {
            toast.error( error?.message || "Failed to login!" );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-900 p-4">
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

            <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
                            <NotebookTabs className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-base">
                        Sign in to your secure notes account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={ handleSubmit } className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={ email }
                                    onChange={ ( e ) => setEmail( e.target.value ) }
                                    className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500"
                                />
                            </div>
                            { errors.email && (
                                <p className="text-sm text-red-500">{ errors.email }</p>
                            ) }
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={ password }
                                    onChange={ ( e ) => setPassword( e.target.value ) }
                                    className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500"
                                />
                            </div>
                            { errors.password && (
                                <p className="text-sm text-red-500">{ errors.password }</p>
                            ) }
                        </div>

                        { errors.general && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">{ errors.general }</p>
                            </div>
                        ) }

                        <Button
                            type="submit"
                            className="w-full h-11 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-500/30 transition-all duration-200 cursor-pointer"
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                        </Button>

                        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                            Don&apos;t have an account?{ ' ' }
                            <Link href="/register" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium">
                                Sign up
                            </Link>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                                Demo credentials:
                            </p>
                            <p className="text-xs text-center text-slate-600 dark:text-slate-300 mt-1">
                                <strong>Admin:</strong> admin@admin.com / admin@admin.com
                            </p>
                            <p className="text-xs text-center text-slate-600 dark:text-slate-300">
                                <strong>User:</strong> user@user.com / user@user.com
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
