"use client";
import React from "react";
import { Provider } from "react-redux";
import store from "@/data/store";
import SessionProviderWrapper from "@/lib/auth/sessionProviderWrapper";
import ThemeProviderWrapper from "../Theme/ThemeProviderWrapper";

type Props = {
  children: React.ReactNode;
};

export default function ClientProvider({ children }: Props) {
  return (
    <SessionProviderWrapper>
      <Provider store={store}>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </Provider>
    </SessionProviderWrapper>
  );
}
