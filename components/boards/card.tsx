import { numify } from "numify";
import { useSession } from "next-auth/react";

import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Board } from "@/types/board";
import { formatBoardType } from "@/helpers/common/formatBoardType";

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
      className={`w-full border-gray-200 dark:border-gray-800 border rounded-xl transition-[filter] data-[hover-state-enabled=true]:hover:drop-shadow-card-hover mb-2 ${
        active ? "bg-gray-100 dark:bg-gray-900" : " bg-white dark:bg-black"
      }`}
    >
      <CardHeader className="p-3 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          {session && (
            <>
              {!board?.isPrivate ? (
                <div className="h-2 w-2 bg-green-500 rounded-full" />
              ) : (
                <div className="h-2 w-2 bg-red-500 rounded-full" />
              )}
            </>
          )}
          <h3 className="text-sm">
            {board.name.substring(0, 28)}
            {board.name.length > 28 ? "..." : ""}
          </h3>
        </div>
        <div className="flex flex-row gap-2 items-center justify-between">
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
    <Card className="h-full flex flex-col rounded-xl overflow-hidden bg-card">
      <CardHeader className="p-4">
        <h3 className="text-lg font-bold">
          {board.name.substring(0, 28)}
          {board.name.length > 28 ? "..." : ""}
        </h3>
      </CardHeader>
      <CardContent>
        <p>
          {board.description.length > 100
            ? `${board.description.substring(0, 100)}...`
            : board.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 bg-secondary">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row gap-2">
            {session && !board?.isPrivate && (
              <Badge
                className="text-xs bg-green-200 text-green-900"
                variant="outline"
              >
                Public
              </Badge>
            )}
            {board?.isPrivate && (
              <Badge
                className="text-xs bg-red-100 text-red-700"
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
        </div>
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
