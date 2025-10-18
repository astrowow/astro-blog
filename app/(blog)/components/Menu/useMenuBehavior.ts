"use client";

import { useEffect } from "react";
import { useMenu } from "./MenuContext";

/**
 * Hook personalizado para manejar comportamientos avanzados del menú
 * Incluye cierre automático con Escape y manejo de accesibilidad
 */
export function useMenuBehavior() {
  const { isMenuOpen, closeMenu } = useMenu();

  // Cerrar menú con tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
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
  }, [isMenuOpen, closeMenu]);

  return { isMenuOpen, closeMenu };
}