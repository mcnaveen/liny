"use client";

import React, { FC } from "react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
  showText?: boolean;
}
export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  showText = false,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const onChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      aria-label="Toggle theme"
      className={clsx("w-full cursor-pointer", className)}
      onClick={onChange}
    >
      {theme === "light" || isSSR ? (
        <span className="flex items-center gap-2">
          <MoonFilledIcon size={22} />
          {showText && <span>Dark</span>}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <SunFilledIcon size={22} />
          {showText && <span>Light</span>}
        </span>
      )}
    </button>
  );
};
