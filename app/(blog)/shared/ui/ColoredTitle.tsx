"use client";

const COLORS = ["text-[#F1C21E]", "text-[#045396]", "text-[#E83B13]", "text-[#09935F]"];

/**
 * Renders each character of a title in rotating UdeA brand colors.
 * Uses a stable key based on position (safe because the title is static text
 * that never reorders).
 */
export default function ColoredTitle({
  title,
  className,
  style,
}: {
  title: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <>
      {Array.from(title).map((ch, pos) => (
        <span
          key={`pos-${pos}-${ch}`}
          aria-hidden="true"
          className={`${COLORS[pos % 4]}${className ? ` ${className}` : ""}`}
          style={style}
        >
          {ch}
        </span>
      ))}
    </>
  );
}
