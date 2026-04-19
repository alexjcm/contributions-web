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

export const SummaryPage = () => {
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
      <div className="rounded-[1.2rem] border border-danger-300 bg-danger-100/70 p-4 text-sm font-medium text-danger-900 animate-in fade-in slide-in-from-top-1">
        No se pudo cargar el resumen: {summary.error}
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
      label: "Sin aportación",
      value: pendingCount,
      className: "border-neutral-300 bg-neutral-100/90 text-neutral-700"
    },
    {
      label: "Colaborando",
      value: incompleteCount,
      className: "border-primary-300 bg-primary-100/70 text-primary-800"
    },
    {
      label: "Meta alcanzada",
      value: completeCount,
      className: "border-success-300 bg-success-100/70 text-success-800"
    },
    {
      label: "Destacados",
      value: overpaidCount,
      className: "border-success-400 bg-success-100/70 text-success-900"
    }
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Resumen de Aportes</h2>
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
          <div className="flex items-center gap-3 text-neutral-400">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/50 bg-white/60 shadow-sm">
              <TrendingUp size={24} className="text-primary-700" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/50 bg-white/60 shadow-sm">
              <Scale size={24} className="text-primary-400" />
            </div>
          </div>
        </div>

        <div className="relative grid gap-4 sm:grid-cols-[1.45fr_0.9fr] sm:items-stretch">
          <div className="rounded-[1.4rem] border border-primary-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(239,246,255,0.86))] p-5 shadow-card sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary-600">Total Recaudado</p>
            <p className="mt-4 text-4xl leading-none text-primary-900 sm:text-6xl">
              {formatCentsAsCurrency(totals.collectedCents)}
            </p>
            <p className="mt-6 max-w-xl text-sm leading-6 text-neutral-600">
              Acumulado total de aportes efectivamente recibidos durante el año fiscal en curso.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-primary-300 bg-primary-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-900">
                Meta proyectada: {formatCentsAsCurrency(totals.expectedCents)}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[1.3rem] border border-primary-100 bg-white/94 px-6 py-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-4">Estados operativos</p>
            <div className="flex flex-col gap-3">
              {operationalStats.map((item) => (
                <div key={item.label} className={`flex items-center justify-between rounded-xl border px-4 py-2.5 ${item.className}`}>
                  <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                  <span className="text-lg font-black">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card header="Avance Operativo por Contribuyente" bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(239,246,255,0.52))] px-6 py-3">
          <p className="text-[12px] font-semibold tracking-[0.01em] text-neutral-600">
            Seguimiento individual del estado anual y del avance efectivo por contribuyente.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-primary-50/60">
              <tr>
                <th className="px-6 py-3 text-left font-bold uppercase tracking-wider text-neutral-600 text-[11px]">Contribuyente</th>
                <th className="px-6 py-3 text-left font-bold uppercase tracking-wider text-neutral-600 text-[11px]">Estado</th>
                <th className="px-6 py-3 text-right font-bold uppercase tracking-wider text-neutral-600 text-[11px]">Pagado</th>
                <th className="px-6 py-3 text-right font-bold uppercase tracking-wider text-neutral-600 text-[11px]">Progreso Anual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contributors.map((item) => (
                <tr key={item.contributorId} className="group transition-colors hover:bg-primary-50/50">
                  <td className="px-6 py-3.5">
                    <div>
                      <div className="text-sm font-bold text-neutral-900">
                        {item.name}
                      </div>
                    </div>

                  </td>
                  <td className="px-6 py-3.5">
                    <ContributionStateBadge state={item.state} />
                  </td>
                  <td className="px-6 py-3.5 text-right font-extrabold text-neutral-900">{formatCentsAsCurrency(item.totalPaidCents)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <span className="text-xs font-bold text-neutral-700">{Math.floor(item.monthsComplete)}/12</span>
                       <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-200">
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
