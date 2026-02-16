'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function NotesSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <Card
          key={idx}
          className="border-slate-200 dark:border-slate-800"
        >
          <CardHeader>
            <div className="h-5 w-3/4 bg-slate-300 dark:bg-slate-700 rounded"></div>
            <div className="mt-2 h-3 w-1/2 bg-slate-200 dark:bg-slate-600 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-full"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-full"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-5/6"></div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="h-4 w-12 bg-slate-300 dark:bg-slate-700 rounded"></div>
              <div className="h-4 w-16 bg-slate-300 dark:bg-slate-700 rounded"></div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 pt-4">
            <div className="h-7 w-16 bg-slate-300 dark:bg-slate-700 rounded"></div>
            <div className="h-7 w-16 bg-slate-300 dark:bg-slate-700 rounded"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
