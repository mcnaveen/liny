export default function PrivateBoard({ type }: { type: "project" | "board" }) {
  return (
    <div className="h-auto py-4 sm:py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-2xl font-bold">
            Private {type.charAt(0).toUpperCase() + type.slice(1)}
          </h1>
          <p>
            This {type.charAt(0).toUpperCase() + type.slice(1)} is private. You
            need to have access to view
          </p>
        </div>
      </div>
    </div>
  );
}
