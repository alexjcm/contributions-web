import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const Card = ({
  children,
  header,
  footer,
  className = "",
  bodyClassName = "",
}: CardProps) => {
  return (
    <article
      className={`overflow-hidden rounded-[1.25rem] border border-[color:var(--color-border)] bg-[color:var(--color-card)] shadow-[0_12px_30px_rgba(37,99,235,0.06)] transition-all hover:shadow-[0_16px_34px_rgba(37,99,235,0.10)] ${className}`}
    >
      {header && (
        <div className="border-b border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(239,246,255,0.42))] px-6 py-4">
          <div className="text-sm font-semibold tracking-[0.01em] text-slate-900">{header}</div>
        </div>
      )}
      <div className={`px-6 py-5 ${bodyClassName}`}>
        {children}
      </div>
      {footer && (
        <div className="border-t border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.66),rgba(239,246,255,0.34))] px-6 py-3">
          {footer}
        </div>
      )}
    </article>
  );
};
