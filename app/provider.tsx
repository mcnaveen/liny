"use client";

import React, { createContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

type LoginDialogContextType = {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoginDialogContext = createContext<LoginDialogContextType>({
  value: false,
  setValue: () => {},
});

export const Provider = ({ children, themeProps }: ProvidersProps) => {
  const queryClient = new QueryClient();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <NextThemesProvider {...themeProps}>
      <QueryClientProvider client={queryClient}>
        <LoginDialogContext.Provider
          value={{ value: showLoginDialog, setValue: setShowLoginDialog }}
        >
          {children}
        </LoginDialogContext.Provider>
      </QueryClientProvider>
    </NextThemesProvider>
  );
};
