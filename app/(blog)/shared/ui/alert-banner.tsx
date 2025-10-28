"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore, useTransition, useEffect, useRef } from "react";

import { disableDraftMode } from "../lib/actions";

const emptySubscribe = () => () => {};

export default function AlertBanner() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement | null>(null);

  const shouldShow = useSyncExternalStore(
    emptySubscribe,
    () => window.top === window,
    () => false,
  );

  // Actualiza la variable CSS --banner-height con la altura real del banner
  useEffect(() => {
    const updateHeight = () => {
      const h = ref.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--banner-height", `${h}px`);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
      document.documentElement.style.setProperty("--banner-height", "0px");
    };
  }, [shouldShow, pending]);

  if (!shouldShow) return null;

  return (
    <div
      ref={ref}
      className={`${
        pending ? "animate-pulse" : ""
      } fixed top-0 left-0 z-50 w-full border-b bg-white/95 text-black backdrop-blur`}
    >
      <div className="py-2 text-center text-sm">
        {pending ? (
          "Disabling draft mode..."
        ) : (
          <>
            {"Previewing drafts. "}
            <button
              type="button"
              onClick={() =>
                startTransition(() =>
                  disableDraftMode().then(() => {
                    router.refresh();
                  }),
                )
              }
              className="hover:text-cyan underline transition-colors duration-200"
            >
              Back to published
            </button>
          </>
        )}
      </div>
    </div>
  );
}
