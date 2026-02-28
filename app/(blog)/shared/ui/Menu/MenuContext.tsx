"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MenuState {
  isMenuOpen: boolean;
}

interface MenuActions {
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

interface MenuContextValue {
  state: MenuState;
  actions: MenuActions;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

interface MenuProviderProps {
  children: ReactNode;
}

export function MenuProvider({ children }: MenuProviderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const value: MenuContextValue = {
    state: { isMenuOpen },
    actions: { openMenu, closeMenu, toggleMenu },
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu(): MenuContextValue {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}