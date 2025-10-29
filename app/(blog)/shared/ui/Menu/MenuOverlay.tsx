"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMenuBehavior } from "./useMenuBehavior";
import { useState, useRef } from "react";

export default function MenuOverlay() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMenuOpen, closeMenu } = useMenuBehavior();
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/aboutus", label: "Nosotros" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const searchUrl = `/categories?search=${encodeURIComponent(searchTerm.trim())}&category=all`;
      
      // Si ya estamos en la página de categorías, usamos replace con timestamp para forzar re-render
      if (pathname.startsWith('/categories')) {
        // Agregamos un timestamp para forzar la navegación sin recarga completa
        const urlWithTimestamp = `${searchUrl}&t=${Date.now()}`;
        router.replace(urlWithTimestamp);
      } else {
        router.push(searchUrl);
      }
      
      // Cerrar el overlay y limpiar el input
      closeMenu();
      setSearchTerm("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
  };

  return (
    <div
      className={[
        "fixed inset-0 z-50 bg-[var(--black)] text-[var(--cream)] transition-opacity duration-200",
        isMenuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      ].join(" ")}
      aria-hidden={!isMenuOpen}
    >
      <div className="container mx-auto flex h-full flex-col justify-between px-5">
        {/* Top bar with close */}
        <div className="flex justify-end  mt-10">
        </div>

        {/* Items */}
        <div className="-mt-[5vh] w-full">
          {links.map(({ href, label }) => (
            <div key={href} className="mb-[1.5vh]">
              <Link href={href} onClick={closeMenu}>
                <h1
                  className={[
                    "text-[clamp(3rem,12vw,8.5rem)] leading-[0.9] font-extrabold tracking-[-0.02em] text-[var(--cream)] hover:underline",
                    pathname === href ? "!text-[var(--rollover)] underline" : "",
                  ].join(" ")}
                >
                  {label}
                </h1>
              </Link>
            </div>
          ))}
          
          {/* Search Input */}
          <div className="mb-[1.5vh]">
            <form onSubmit={handleSearchSubmit}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full bg-transparent border-b-2 border-[var(--cream)] text-[clamp(3rem,12vw,8.5rem)] leading-[0.9] font-extrabold tracking-[-0.02em] text-[var(--cream)] placeholder-[var(--cream)]/70 focus:outline-none focus:border-[var(--rollover)] transition-colors duration-200 pb-2"
              />
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end py-6">
          <div className="flex gap-6">
            <a
              className="text-sm uppercase"
              href="https://instagram.com/grupoastrowow"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              className="text-sm uppercase"
              href="https://www.youtube.com/@grupoastrowow"
              target="_blank"
              rel="noreferrer"
            >
              YouTube
            </a>
            <a
              className="text-sm uppercase"
              href="https://www.facebook.com/share/1Fw1L8LxVU/"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
            <a
              className="text-sm uppercase"
              href="https://www.tiktok.com/@grupoastrowow"
              target="_blank"
              rel="noreferrer"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}