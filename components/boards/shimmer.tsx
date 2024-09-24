import { Card, CardHeader, CardFooter } from "@/components/ui/card";

export const BoardShimmer = ({ layout }: { layout: string }) => {
  return (
    <Card className="w-full border-gray-200 bg-white dark:bg-black dark:border-gray-800 border rounded-xl transition-[filter] data-[hover-state-enabled=true]:hover:drop-shadow-card-hover">
      <CardHeader className="flex flex-row justify-between z-10">
        <div className="h-2 w-3/4 bg-gray-200 animate-pulse rounded" />
      </CardHeader>
      {layout === "grid" && (
        <CardFooter className="flex flex-row justify-between gap-2 z-10">
          <div className="flex flex-row gap-2">
            <div className="h-5 w-[80px] bg-gray-200 animate-pulse rounded" />
            <div className="h-5 w-[80px] bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="h-5 w-[20px] bg-gray-200 animate-pulse rounded" />
        </CardFooter>
      )}
    </Card>
  );
};
