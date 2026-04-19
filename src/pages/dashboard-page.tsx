import { useMemo } from "react";
import { TrendingUp, Scale } from "lucide-react";

import { SectionLoader } from "../components/ui/loaders";
import { ContributionStateBadge } from "../components/ui/state-badge";
import { YearSelect } from "../components/ui/year-select";
import { useAppContext } from "../context/app-context";
import { formatCentsAsCurrency } from "../lib/money";
import { useSummary } from "../hooks/use-summary";
import { Card } from "../components/ui/card";
import type { ContributionState } from "../types/domain";

const getStatePriority = (state: ContributionState): number => {
  switch (state) {
    case "pending":
      return 0;
    case "incomplete":
      return 1;
    case "overpaid":
      return 2;
    case "complete":
      return 3;
    default:
      return 4;
  }
};

export const DashboardPage = () => {
  const { activeYear, currentBusinessYear, setActiveYear } = useAppContext();
  const summary = useSummary(activeYear);

  const contributors = useMemo(() => {
    return [...(summary.data?.contributors ?? [])].sort((left, right) => {
      const stateDiff = getStatePriority(left.state) - getStatePriority(right.state);

      if (stateDiff !== 0) {
        return stateDiff;
      }

      if (left.status !== right.status) {
        return right.status - left.status;
      }

      return left.name.localeCompare(right.name, "es");
    });
  }, [summary.data]);

  if (summary.loading && !summary.data) {
    return <SectionLoader label="Cargando resumen anual..." />;
  }

  if (summary.error) {
    return (
      <div className="rounded-[1.2rem] border border-rose-300 bg-rose-100/70 p-4 text-sm font-medium text-rose-900 animate-in fade-in slide-in-from-top-1">
        No se pudo cargar el dashboard: {summary.error}
      </div>
    );
  }

  if (!summary.data) {
    return null;
  }

  const { totals } = summary.data;
  const pendingCount = contributors.filter((item) => item.state === "pending").length;
  const incompleteCount = contributors.filter((item) => item.state === "incomplete").length;
  const completeCount = contributors.filter((item) => item.state === "complete").length;
  const overpaidCount = contributors.filter((item) => item.state === "overpaid").length;
  const operationalStats = [
    {
      label: "Pendientes",
      value: pendingCount,
      className: "border-stone-300 bg-stone-100/90 text-stone-700"
    },
    {
      label: "Incompletos",
      value: incompleteCount,
      className: "border-amber-300 bg-amber-100/70 text-amber-800"
    },
    {
      label: "Completos",
      value: completeCount,
      className: "border-emerald-300 bg-emerald-100/70 text-emerald-800"
    },
    {
      label: "Excedentes",
      value: overpaidCount,
        className: "border-blue-300 bg-blue-100/70 text-blue-800"
    }
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Dashboard de Aportes</h2>
          </div>
          <YearSelect
            activeYear={activeYear}
            currentBusinessYear={currentBusinessYear}
            setActiveYear={setActiveYear}
            compact
          />
        </div>
      </header>

      <Card
        className="relative overflow-hidden border-primary-300 bg-[linear-gradient(145deg,rgba(255,255,255,0.99),rgba(239,246,255,0.98))]"
        bodyClassName="px-5 py-5 sm:px-7 sm:py-7"
      >
        <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.22),transparent_58%)] sm:block" />
        <div className="absolute right-5 top-5 hidden opacity-80 sm:block">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/50 bg-white/60 shadow-sm">
              <TrendingUp size={24} className="text-primary-700" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/50 bg-white/60 shadow-sm">
              <Scale size={24} className="text-primary-400" />
            </div>
          </div>
        </div>

        <div className="relative grid gap-4 sm:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.9fr)] sm:items-stretch">
          <div className="rounded-[1.4rem] border border-[rgba(37,99,235,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(239,246,255,0.86))] p-5 shadow-[0_18px_36px_rgba(37,99,235,0.12)] sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary-600">Pendiente por cubrir</p>
            <p className="mt-4 text-4xl leading-none text-primary-900 sm:text-5xl">
              {formatCentsAsCurrency(Math.abs(totals.differenceCents))}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
              Este balance representa la diferencia entre la meta anual proyectada y lo efectivamente recaudado hasta el momento.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-primary-300 bg-primary-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-900">
                Meta anual: {formatCentsAsCurrency(totals.expectedCents)}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1.3rem] border border-[rgba(37,99,235,0.12)] bg-[rgba(255,255,255,0.94)] px-4 py-4 shadow-[0_12px_28px_rgba(37,99,235,0.08)] sm:px-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Recaudado</p>
              <p className="mt-2 text-2xl leading-none text-slate-900 sm:text-[2rem]">{formatCentsAsCurrency(totals.collectedCents)}</p>
              <p className="mt-2 text-sm text-slate-600">Acumulado del año en curso.</p>
            </div>
            <div className="rounded-[1.3rem] border border-[rgba(37,99,235,0.12)] bg-[rgba(255,255,255,0.94)] px-4 py-4 shadow-[0_12px_28px_rgba(37,99,235,0.08)] sm:px-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Estados operativos</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {operationalStats.map((item) => (
                  <span key={item.label} className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${item.className}`}>
                    {item.label}: {item.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card header="Avance Operativo por Contribuyente" bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(239,246,255,0.52))] px-6 py-3">
          <p className="text-[12px] font-semibold tracking-[0.01em] text-slate-600">
            Seguimiento individual del estado anual y del avance efectivo por contribuyente.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-[rgba(239,246,255,0.62)]">
              <tr>
                <th className="px-6 py-3 text-left font-bold uppercase tracking-wider text-slate-600 text-[11px]">Contribuyente</th>
                <th className="px-6 py-3 text-left font-bold uppercase tracking-wider text-slate-600 text-[11px]">Estado</th>
                <th className="px-6 py-3 text-right font-bold uppercase tracking-wider text-slate-600 text-[11px]">Pagado</th>
                <th className="px-6 py-3 text-right font-bold uppercase tracking-wider text-slate-600 text-[11px]">Balance</th>
                <th className="px-6 py-3 text-right font-bold uppercase tracking-wider text-slate-600 text-[11px]">Progreso Anual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-border)]">
              {contributors.map((item) => (
                <tr key={item.contributorId} className="group transition-colors hover:bg-primary-50/50">
                  <td className="px-6 py-3.5">
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {item.name}
                      </div>
                      <div>
                        {item.email && <p className="text-xs text-slate-600">{item.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <ContributionStateBadge state={item.state} />
                  </td>
                  <td className="px-6 py-3.5 text-right font-extrabold text-slate-900">{formatCentsAsCurrency(item.totalPaidCents)}</td>
                  <td className={`px-6 py-3.5 text-right font-semibold ${item.differenceCents < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {formatCentsAsCurrency(item.differenceCents)}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <span className="text-xs font-bold text-slate-700">{item.monthsComplete}/12</span>
                       <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[rgba(66,90,111,0.12)]">
                          <div 
                            className="h-full rounded-full bg-primary-600" 
                            style={{ width: `${(item.monthsComplete / 12) * 100}%` }}
                          />
                       </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
