import * as React from "react";

import { cn } from "@/lib/utils";

interface MoonIconProps extends React.SVGProps<SVGSVGElement> {}
export function MoonIcon(props: MoonIconProps) {
  return (
    <svg
      className={cn("w-6 h-6", props.className)}
      fill="currentColor"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.59 1.617a.75.75 0 01-.047.836 7.843 7.843 0 00-1.585 4.75c0 4.294 3.388 7.74 7.527 7.74 1.141 0 2.221-.26 3.19-.726a.75.75 0 011.027.94c-1.45 3.847-5.1 6.593-9.39 6.593-5.575 0-10.062-4.63-10.062-10.301 0-5.16 3.713-9.456 8.583-10.19a.75.75 0 01.756.358zm-2.237 1.57C6.091 4.423 3.75 7.647 3.75 11.45c0 4.879 3.851 8.801 8.562 8.801 3.015 0 5.676-1.604 7.203-4.04a8.856 8.856 0 01-2.03.234c-5.003 0-9.027-4.155-9.027-9.24 0-1.438.321-2.801.895-4.017z"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default MoonIcon;
