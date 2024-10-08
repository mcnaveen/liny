import * as React from "react";
import clsx from "clsx";

interface LifebuoyIconProps extends React.SVGProps<SVGSVGElement> {}
export function LifebuoyIcon(props: LifebuoyIconProps) {
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
        d="M9.213 8.153L6.011 4.95A9.21 9.21 0 0112 2.75a9.21 9.21 0 015.989 2.2l-3.203 3.203A4.728 4.728 0 0012 7.25a4.729 4.729 0 00-2.787.903zm-1.06 1.06L4.95 6.011A9.21 9.21 0 002.75 12a9.21 9.21 0 002.2 5.989l3.203-3.203A4.728 4.728 0 017.25 12c0-1.041.335-2.004.903-2.787zm1.06 6.634L6.011 19.05A9.211 9.211 0 0012 21.25a9.211 9.211 0 005.989-2.2l-3.203-3.203A4.728 4.728 0 0112 16.75a4.729 4.729 0 01-2.787-.903zm6.634-1.06l3.203 3.202A9.211 9.211 0 0021.25 12a9.211 9.211 0 00-2.2-5.989l-3.203 3.202c.568.783.903 1.746.903 2.787a4.728 4.728 0 01-.903 2.787zM12 1.25a10.719 10.719 0 00-7.601 3.149A10.719 10.719 0 001.25 12c0 2.968 1.204 5.657 3.149 7.601A10.719 10.719 0 0012 22.75c2.968 0 5.657-1.204 7.601-3.149A10.719 10.719 0 0022.75 12c0-2.968-1.204-5.657-3.149-7.601A10.719 10.719 0 0012 1.25zM8.75 12a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0z"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default LifebuoyIcon;
