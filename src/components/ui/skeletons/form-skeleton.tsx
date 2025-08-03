import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FormSkeletonProps {
  fields?: number;
  columns?: 1 | 2;
  showHeader?: boolean;
  showActions?: boolean;
}

export const FormSkeleton = ({ 
  fields = 8, 
  columns = 2,
  showHeader = true,
  showActions = true 
}: FormSkeletonProps) => {
  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      )}

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${columns === 2 ? 'md:grid-cols-2' : ''}`}>
            {Array.from({ length: fields }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          
          {showActions && (
            <div className="flex justify-end space-x-2 mt-6">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-24" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};