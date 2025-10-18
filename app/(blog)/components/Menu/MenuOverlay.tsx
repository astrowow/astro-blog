"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenuBehavior } from "./useMenuBehavior";

export default function MenuOverlay() {
  const pathname = usePathname();
  const { isMenuOpen, closeMenu } = useMenuBehavior();

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/aboutme", label: "Nosotros" },
  ];

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
          <button
            type="button"
            onClick={closeMenu}
            className="hover:underline text-2xl md:text-4xl font-bold "
            aria-label="Cerrar menú"
          >
            Cerrar
          </button>
        </div>

        {/* Items */}
        <div className="-mt-[5vh] w-full">
          {links.map(({ href, label }) => (
            <div key={href} className="mb-[1.5vh]">
              <Link href={href} onClick={closeMenu}>
                <h1
                  className={[
                    "text-[clamp(3rem,12vw,8.5rem)] leading-[0.9] font-extrabold tracking-[-0.02em] text-[var(--cream)] hover:underline",
                    pathname === href ? "!text-[var(--rollover)]" : "",
                  ].join(" ")}
                >
                  {label}
                </h1>
              </Link>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between py-6">
          <p className="text-sm uppercase">© 2025 All Rights Reserved</p>
          <div className="flex gap-6">
            <a
              className="text-sm uppercase"
              href="https://github.com/astrowow"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
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
          </div>
        </div>
      </div>
    </div>
  );
}