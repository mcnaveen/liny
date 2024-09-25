import { Card, CardHeader, CardFooter } from "@/components/ui/card";

export const BoardShimmer = ({ layout }: { layout: string }) => {
  return (
    <Card className="data-[hover-state-enabled=true]:hover:drop-shadow-card-hover w-full rounded-xl border border-gray-200 bg-white transition-[filter] dark:border-gray-800 dark:bg-black">
      <CardHeader className="z-10 flex flex-row justify-between">
        <div className="h-2 w-3/4 animate-pulse rounded bg-gray-200" />
      </CardHeader>
      {layout === "grid" && (
        <CardFooter className="z-10 flex flex-row justify-between gap-2">
          <div className="flex flex-row gap-2">
            <div className="h-5 w-[80px] animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-[80px] animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-5 w-[20px] animate-pulse rounded bg-gray-200" />
        </CardFooter>
      )}
    </Card>
  );
};
