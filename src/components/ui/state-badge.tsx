import type { ContributionState, ContributorStatus } from "../../types/domain";

const stateStyles: Record<ContributionState, string> = {
  pending: "border-neutral-300 bg-neutral-100/90 text-neutral-700",
  incomplete: "border-primary-300 bg-primary-100/70 text-primary-800",
  complete: "border-success-300 bg-success-100/70 text-success-800",
  overpaid: "border-success-400 bg-success-200/50 text-success-900 ring-1 ring-success-200/50"
};

const stateLabels: Record<ContributionState, string> = {
  pending: "Sin aportes",
  incomplete: "Colaborando",
  complete: "Meta alcanzada",
  overpaid: "Colaborador destacado"
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
          ? "border-success-300 bg-success-100/70 text-success-800" 
          : "border-danger-300 bg-danger-100/70 text-danger-800"
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
