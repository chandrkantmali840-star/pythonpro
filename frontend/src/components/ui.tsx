import type { ReactNode } from "react";
export const PageTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <header>
    <h1 className="text-3xl font-black tracking-tight">{title}</h1>
    {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}
  </header>
);
export const Empty = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => (
  <div className="card py-12 text-center">
    <h2 className="text-xl font-bold">{title}</h2>
    <div className="mt-2 text-slate-500">{children}</div>
  </div>
);
export const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
    <div
      className="h-full bg-indigo-600"
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);
