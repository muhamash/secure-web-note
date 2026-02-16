'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditNoteSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-300 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-600 rounded"></div>
        </div>

        {/* Note Card */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>
              <div className="h-5 w-32 bg-slate-300 dark:bg-slate-700 rounded"></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title Input Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-300 dark:bg-slate-700 rounded"></div>
              <div className="h-11 bg-slate-200 dark:bg-slate-600 rounded"></div>
            </div>

            {/* Content Textarea Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-28 bg-slate-300 dark:bg-slate-700 rounded"></div>
              <div className="h-48 bg-slate-200 dark:bg-slate-600 rounded"></div>
            </div>

            {/* Tags Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-20 bg-slate-300 dark:bg-slate-700 rounded"></div>
              <div className="flex space-x-2">
                <div className="h-11 w-40 bg-slate-200 dark:bg-slate-600 rounded"></div>
                <div className="h-11 w-12 bg-slate-200 dark:bg-slate-600 rounded"></div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-600 rounded"></div>
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-600 rounded"></div>
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-600 rounded"></div>
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="h-11 w-24 bg-slate-200 dark:bg-slate-600 rounded"></div>
              <div className="h-11 w-32 bg-slate-200 dark:bg-slate-600 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
