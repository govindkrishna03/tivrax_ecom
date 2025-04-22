'use client';

import { Skeleton } from '../../components/ui/skelton';

export function CartLoading() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-10 w-64 mx-auto mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border">
                <div className="flex flex-col sm:flex-row w-full">
                  <Skeleton className="h-40 sm:h-auto sm:w-1/3" />
                  
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/4 mb-4" />
                      <Skeleton className="h-5 w-1/6" />
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-6 w-8" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                      
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
              <div className="p-4 border-b">
                <Skeleton className="h-6 w-32" />
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-0 flex flex-col space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}