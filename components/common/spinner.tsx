import React from "react";
import clsx from "clsx";

function Spinner({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const spinnerClasses = clsx(
    "inline-block",
    "w-4",
    "h-4",
    "shrink-0",
    "animate-spin",
    "rounded-full",
    "border-solid",
    "border-[1.5px]",
    "border-gray-800", // Changed to a darker color for better visibility in dark mode
    "border-b-transparent",
    "border-l-transparent",
    className,
    "dark:border-gray-200", // Updated for better contrast in dark mode
  );

  return (
    <div className={spinnerClasses}>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;
