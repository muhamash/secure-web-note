'use client';

import { Button } from '@/components/ui/button';
import { menuItems } from '@/lib/constants/menu';
import { cn } from '@/lib/utils';
import
    {
        ChevronLeft,
        ChevronRight,
        LogOut,
        NotebookText
    } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar({ userRole }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();


  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

    return (
        <div
            className={ cn(
                'relative h-screen bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col',
                collapsed ? 'w-20' : 'w-64'
            ) }
        >
            <div className="p-6 flex items-center justify-between border-b border-slate-800">
                { !collapsed && (
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg">
                            <NotebookText className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">SecureNotes</span>
                    </div>
                ) }
                { collapsed && (
                    <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg mx-auto">
                        <NotebookText className="w-5 h-5 text-white" />
                    </div>
                ) }
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={ () => setCollapsed( !collapsed ) }
                className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white z-10"
            >
                { collapsed ? (
                    <ChevronRight className="h-3 w-3" />
                ) : (
                    <ChevronLeft className="h-3 w-3" />
                ) }
            </Button>

            <nav className="flex-1 p-4 space-y-2">
                { filteredMenuItems.map( ( item ) =>
                {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link key={ item.href } href={ item.href }>
                            <div
                                className={ cn(
                                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer',
                                    isActive
                                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                ) }
                            >
                                <Icon
                                    className={ cn(
                                        'h-5 w-5 transition-transform group-hover:scale-110',
                                        collapsed && 'mx-auto'
                                    ) }
                                />
                                { !collapsed && (
                                    <span className="font-medium">{ item.title }</span>
                                ) }
                            </div>
                        </Link>
                    );
                } ) }
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-3">
                {/* Logout Button */ }
                <button
                    onClick={ () => signOut( { callbackUrl: '/login' } ) }
                    className={ cn(
                        'flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 group',
                        'text-red-400 hover:bg-red-500/10 hover:text-red-500'
                    ) }
                >
                    <LogOut
                        className={ cn(
                            'h-5 w-5 transition-transform group-hover:scale-110',
                            collapsed && 'mx-auto'
                        ) }
                    />
                    { !collapsed && <span className="font-medium">Logout</span> }
                </button>

                {/* Role Section */ }
                <div
                    className={ cn(
                        'px-4 py-3 rounded-lg bg-slate-800/50',
                        collapsed && 'px-2'
                    ) }
                >
                    { !collapsed ? (
                        <div className="space-y-1">
                            <p className="text-xs text-slate-400">Role</p>
                            <p className="text-sm font-medium text-white capitalize">
                                { userRole }
                            </p>
                        </div>
                    ) : (
                        <div className="w-2 h-2 bg-green-500 rounded-full mx-auto" />
                    ) }
                </div>
            </div>

        </div>
    );
}
