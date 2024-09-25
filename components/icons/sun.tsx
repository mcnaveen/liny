import * as React from "react";
import clsx from "clsx";

interface SunIconProps extends React.SVGProps<SVGSVGElement> {}
export function SunIcon(props: SunIconProps) {
  return (
    <svg
      className={clsx(props.className)}
      fill="currentColor"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 1.25a.75.75 0 01.75.75v2a.75.75 0 01-1.5 0V2a.75.75 0 01.75-.75zm0 18a.75.75 0 01.75.75v2a.75.75 0 01-1.5 0v-2a.75.75 0 01.75-.75zm0-11.5a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5zM6.25 12a5.75 5.75 0 1111.5 0 5.75 5.75 0 01-11.5 0zM2 11.25a.75.75 0 000 1.5h2a.75.75 0 000-1.5H2zm18 0a.75.75 0 000 1.5h2a.75.75 0 000-1.5h-2zM3.97 3.97a.75.75 0 011.06 0l1.5 1.5a.75.75 0 01-1.06 1.06l-1.5-1.5a.75.75 0 010-1.06zm13.5 13.5a.75.75 0 011.06 0l1.5 1.5a.75.75 0 11-1.06 1.06l-1.5-1.5a.75.75 0 010-1.06zm-13.5 1.5a.75.75 0 101.06 1.06l1.5-1.5a.75.75 0 10-1.06-1.06l-1.5 1.5zm13.5-13.5a.75.75 0 001.06 1.06l1.5-1.5a.75.75 0 00-1.06-1.06l-1.5 1.5z"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SunIcon;
