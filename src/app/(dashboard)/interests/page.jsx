'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import
  {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from '@/components/ui/collapsible';
import { fetchInterest } from '@/lib/services/users/user.service';
import { ChevronDown, ChevronRight, Heart, Users as UsersIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InterestsPage() {
  const [groupedInterests, setGroupedInterests] = useState({});
  const [openItems, setOpenItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setLoading(true);
        

        const result = await fetchInterest();

        console.log( result )
        
        if ( !result?.success )
        {
          setError( result.message );
          return
        }
        
        // Transform the API response to match the component's expected format
        const transformed = {};
        result?.data?.data?.forEach((item) => {
          transformed[item.interest] = item.users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          }));
        });
        
        setGroupedInterests(transformed);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching interests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  const toggleItem = (interest) => {
    setOpenItems((prev) => ({
      ...prev,
      [interest]: !prev[interest],
    }));
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const colors = [
    'from-teal-500 to-teal-600',
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            User Interests
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Browse users grouped by their interests
          </p>
        </div>
        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading interests...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            User Interests
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Browse users grouped by their interests
          </p>
        </div>
        <Card className="border-dashed border-2 border-red-300 dark:border-red-700">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <UsersIcon className="h-16 w-16 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Error loading interests
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-sm">
              {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          User Interests
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Browse users grouped by their interests
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedInterests).map(([interest, users], index) => (
          <Card
            key={interest}
            className="overflow-hidden hover:shadow-lg transition-all duration-200 border-slate-200 dark:border-slate-800"
          >
            <Collapsible open={openItems[interest]}>
              <CardHeader className="pb-3">
                <CollapsibleTrigger
                  onClick={() => toggleItem(interest)}
                  className="w-full"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${
                          colors[index % colors.length]
                        }`}
                      >
                        <Heart className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-lg capitalize">
                          {interest}
                        </CardTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">
                          {users.length} {users.length === 1 ? 'user' : 'users'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className="bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300"
                      >
                        {users.length}
                      </Badge>
                      {openItems[interest] ? (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className={`bg-gradient-to-br ${
                              colors[
                                user.name.charCodeAt(0) % colors.length
                              ]
                            } text-white text-xs`}
                          >
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {Object.keys(groupedInterests).length === 0 && (
        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <UsersIcon className="h-16 w-16 text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No interests found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-sm">
              Users haven&apos;t added any interests yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}