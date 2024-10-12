import { useSession } from "next-auth/react";
import { numify } from "numify";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatBoardType } from "@/helpers/common/formatBoardType";
import { Board } from "@/types/board";

import { Badge } from "../ui/badge";

interface BoardsCardProps {
  board: Board;
  layout: "compact" | "list" | "grid";
  active: boolean;
}

export const BoardsCard: React.FC<BoardsCardProps> = ({
  board,
  layout = "list",
  active,
}) => {
  const { data: session } = useSession();

  const ListLayout = () => (
    <Card
      className={`data-[hover-state-enabled=true]:hover:drop-shadow-card-hover mb-2 w-full rounded-xl border border-gray-200 transition-[filter] dark:border-gray-800 ${
        active ? "bg-gray-100 dark:bg-gray-900" : "bg-white dark:bg-black"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between p-3">
        <div className="flex flex-row items-center gap-2">
          {session && (
            <>
              {!board?.isPrivate ? (
                <div className="h-2 w-2 rounded-full bg-green-500" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-red-500" />
              )}
            </>
          )}
          <h3 className="text-sm">
            {board.name.substring(0, 28)}
            {board.name.length > 28 ? "..." : ""}
          </h3>
        </div>
        <div className="flex flex-row items-center justify-between gap-2">
          <Badge className="text-xs font-normal" variant="outline">
            {formatBoardType(board.boardType)}
          </Badge>
          <Badge className="text-xs font-normal" variant="outline">
            {board?._count?.posts ? numify(board?._count.posts) : "0"}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );

  const GridLayout = () => (
    <Card className="h-full flex flex-col">
      <CardHeader className="grow">
        <CardTitle className="truncate">{board.name}</CardTitle>
        <CardDescription>
          {board.description.length > 100
            ? `${board.description.substring(0, 100)}...`
            : board.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="bg-secondary pt-6 justify-between">
        <div className="flex gap-2">
          {session && !board?.isPrivate && (
            <Badge
              className="bg-green-200 text-xs text-green-900"
              variant="outline"
            >
              Public
            </Badge>
          )}
          {board?.isPrivate && (
            <Badge
              className="bg-red-100 text-xs text-red-700"
              variant="outline"
            >
              Private
            </Badge>
          )}
          <Badge className="text-xs" variant="outline">
            {formatBoardType(board.boardType)}
          </Badge>
        </div>

        <Badge className="text-xs" variant="outline">
          {board?._count?.posts ? numify(board?._count.posts) : "0"}
        </Badge>
      </CardFooter>
    </Card>
  );

  switch (layout) {
    case "list":
      return <ListLayout />;
    case "grid":
      return <GridLayout />;
    default:
      return <ListLayout />;
  }
};
