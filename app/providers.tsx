"use client";
import { Sidebar } from "@/components/ui/Sidebar/Sidebar";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const theme = createTheme({
  other: {
    primary: "#44634c",
    surface: "#131315",
    "surface-container": "#191A1C",
    "surface-container-high": "#1D1E20",
    "surface-container-highest": "#232428",
  },
  colors: {
    primary: [
      "#f3f7f4",
      "#e7eae8",
      "#cad4cd",
      "#abbeaf",
      "#90ab96",
      "#7e9f86",
      "#75997e",
      "#63856b",
      "#56765e",
      "#44634c",
    ],
  },

  // surface: [
  //   "#f4f4f5",
  //   "#e6e6e6",
  //   "#cbcbcb",
  //   "#aeaeae",
  //   "#969696",
  //   "#868688",
  //   "#7f7f82",
  //   "#6c6c70",
  //   "#606065",
  //   "#131315",
  // ],
  // "surface-container": [
  //   "#191A1C",
  //   "#191A1C",
  //   "#191A1C",
  //   "#191A1C",
  //   "#191A1C",
  //   "#191A1C",
  //   "#191A1C",
  //   "#191A1C",
  //   "#191A1C",
  //   "#191A1C",
  // ],
  // "surface-container-high": [
  //   "#1D1E20",
  //   "#1D1E20",
  //   "#1D1E20",
  //   "#1D1E20",
  //   "#1D1E20",
  //   "#1D1E20",
  //   "#1D1E20",
  //   "#1D1E20",
  //   "#1D1E20",
  //   "#1D1E20",
  // ],
  // "surface-container-highest": [
  //   "#232428",
  //   "#232428",
  //   "#232428",
  //   "#232428",
  //   "#232428",
  //   "#232428",
  //   "#232428",
  //   "#232428",
  //   "#232428",
  //   "#232428",
  // ],

  primaryColor: "primary",
});

const client = new QueryClient({});

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={client}>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <Sidebar />
        <main className="main">{children}</main>
      </MantineProvider>
    </QueryClientProvider>
  );
};
