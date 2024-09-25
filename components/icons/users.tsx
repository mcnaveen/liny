import clsx from "clsx";
import * as React from "react";

interface UsersIconProps extends React.SVGProps<SVGSVGElement> {}
export function UsersIcon(props: UsersIconProps) {
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
        d="M4.75 6a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zM8 1.25a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zm7 0a.75.75 0 000 1.5 3.25 3.25 0 010 6.5.75.75 0 000 1.5 4.75 4.75 0 100-9.5zM.25 18.8a5.55 5.55 0 015.55-5.55h4.4a5.55 5.55 0 015.55 5.55 3.95 3.95 0 01-3.95 3.95H4.2A3.95 3.95 0 01.25 18.8zm5.55-4.05a4.05 4.05 0 00-4.05 4.05 2.45 2.45 0 002.45 2.45h7.6a2.45 2.45 0 002.45-2.45 4.05 4.05 0 00-4.05-4.05H5.8zm11.2-1.5a.75.75 0 000 1.5h1.2a4.05 4.05 0 014.05 4.05 2.45 2.45 0 01-2.45 2.45H17a.75.75 0 000 1.5h2.8a3.95 3.95 0 003.95-3.95 5.55 5.55 0 00-5.55-5.55H17z"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default UsersIcon;
