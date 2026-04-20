export const Spinner = ({ className = "h-5 w-5" }: { className?: string }) => {
  return (
    <span
      className={`${className} inline-block animate-spin rounded-full border-2 border-primary-100 border-t-primary-700`}
      aria-hidden="true"
    />
  );
};

export const PageLoader = ({ label = "Cargando..." }: { label?: string }) => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-neutral-600 dark:text-neutral-400">
      <div className="relative flex items-center justify-center">
        <Spinner className="h-12 w-12" />
        <div className="absolute h-6 w-6 animate-pulse rounded-full bg-primary-100/80" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-700/80 dark:text-primary-400/80">{label}</p>
    </div>
  );
};

export const SectionLoader = ({ label = "Cargando datos..." }: { label?: string }) => {
  return (
    <div className="flex items-center gap-4 rounded-[var(--radius-pill)] border border-primary-200 border-dashed bg-[var(--gradient-loader)] p-5 text-sm text-neutral-700 shadow-sm dark:border-primary-800 dark:text-neutral-300">
      <Spinner className="h-6 w-6" />
      <span className="font-medium tracking-[0.01em]">{label}</span>
    </div>
  );
};

