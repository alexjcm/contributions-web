import type { ContributionState, ContributorStatus } from "../../types/domain";

const stateStyles: Record<ContributionState, string> = {
  pending: "border-stone-300 bg-stone-100/90 text-stone-700",
  incomplete: "border-amber-300 bg-amber-100/70 text-amber-800",
  complete: "border-emerald-300 bg-emerald-100/70 text-emerald-800",
  overpaid: "border-blue-300 bg-blue-100/70 text-blue-800"
};

const stateLabels: Record<ContributionState, string> = {
  pending: "Pendiente",
  incomplete: "Incompleto",
  complete: "Completo",
  overpaid: "Excedente"
};

export const ContributionStateBadge = ({ state }: { state: ContributionState }) => {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${stateStyles[state]}`}>
      {stateLabels[state]}
    </span>
  );
};

export const ContributorStatusBadge = ({ status }: { status: ContributorStatus }) => {
  const isActive = status === 1;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
        isActive 
          ? "border-emerald-300 bg-emerald-100/70 text-emerald-800" 
          : "border-rose-300 bg-rose-100/70 text-rose-800"
      }`}
    >
      {isActive ? "Activo" : "Inactivo"}
    </span>
  );
};


export const getContributionCellState = (amountCents: number, monthlyAmountCents: number): ContributionState => {
  if (amountCents <= 0) {
    return "pending";
  }

  if (amountCents < monthlyAmountCents) {
    return "incomplete";
  }

  if (amountCents === monthlyAmountCents) {
    return "complete";
  }

  return "overpaid";
};
