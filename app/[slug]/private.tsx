export default function PrivateBoard({ type }: { type: "project" | "board" }) {
  return (
    <div className="mx-auto h-auto max-w-7xl py-4 sm:py-6">
      <div className="flex h-screen items-center justify-center">
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
