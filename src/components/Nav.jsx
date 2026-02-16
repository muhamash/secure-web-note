'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Navbar({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

    return (
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Dashboard
                </h1>
                <Badge
                    variant="outline"
                    className="capitalize bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                >
                    { user?.role }
                </Badge>
            </div>

            <div className="flex items-center space-x-3">

                <Button
                    variant="ghost"
                    className="flex items-center space-x-3 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white text-sm">
                            { getInitials( user?.name || 'User' ) }
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            { user?.name }
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            { user?.email }
                        </p>
                    </div>
                </Button>
            </div>
        </div>
    );
}