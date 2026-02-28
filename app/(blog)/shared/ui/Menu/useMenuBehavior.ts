"use client";

import { useEffect } from "react";
import { useMenu } from "./MenuContext";

/**
 * Hook personalizado para manejar comportamientos avanzados del menú
 * Incluye cierre automático con Escape y manejo de accesibilidad
 */
export function useMenuBehavior() {
  const { state, actions } = useMenu();

  // Cerrar menú con tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && state.isMenuOpen) {
        actions.closeMenu();
      }
    };

    if (state.isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [state.isMenuOpen, actions.closeMenu]);

  return { isMenuOpen: state.isMenuOpen, closeMenu: actions.closeMenu };
}