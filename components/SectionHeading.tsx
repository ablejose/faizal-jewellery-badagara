import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  as = "h2",
  children,
}: SectionHeadingProps) {
  const Tag = as;
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-4 ${alignment}`}>
      {eyebrow ? <span className="label-eyebrow">{eyebrow}</span> : null}
      <Tag className="font-display text-display-l text-ivory">{title}</Tag>
      {subtitle ? (
        <p className="max-w-2xl font-sans text-body-lg text-muted">{subtitle}</p>
      ) : null}
      {children}
    </div>
  );
}
