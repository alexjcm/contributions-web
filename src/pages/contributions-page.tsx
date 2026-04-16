import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Edit2, Filter, Plus, ReceiptText, Trash2, X } from "lucide-react";

import { ContributionModal, type ContributionPayload } from "../components/contributions/contribution-modal";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ConfirmModal } from "../components/ui/confirm-modal";
import { Select } from "../components/ui/fields";
import { SectionLoader } from "../components/ui/loaders";
import { ContributorStatusBadge } from "../components/ui/state-badge";
import { useAppContext } from "../context/app-context";
import { useApiClient } from "../hooks/use-api-client";
import { useContributions } from "../hooks/use-contributions";
import { useContributors } from "../hooks/use-contributors";
import { useInvalidateResources } from "../hooks/use-resource-invalidation";
import { useSettings } from "../hooks/use-settings";
import { getCurrentBusinessMonth } from "../lib/business-time";
import { getMonthLabel } from "../lib/date";
import { formatCentsAsCurrency } from "../lib/money";
import { RESOURCE_KEYS } from "../lib/resource-invalidation";
import type { Contribution, Contributor } from "../types/domain";

const PAGE_SIZE = 10;

type EditState = {
  contribution: Contribution | null;
  open: boolean;
};

const formatPeriodLabel = (month: number, year: number): string =>
  `${getMonthLabel(month).replace(/^./, (value) => value.toUpperCase())}/${year}`;

export const ContributionsPage = () => {
  const { activeYear, canMutateCurrentPeriod, contributionRestrictionMessage } = useAppContext();
  const api = useApiClient();
  const invalidateResources = useInvalidateResources();

  const contributors = useContributors("all");
  const settings = useSettings();

  const [contributorIdFilter, setContributorIdFilter] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);

  const [editState, setEditState] = useState<EditState>({ contribution: null, open: false });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [pendingDelete, setPendingDelete] = useState<Contribution | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const contributions = useContributions({
    year: activeYear,
    contributorId: contributorIdFilter,
    pageNumber,
    pageSize: PAGE_SIZE
  });

  useEffect(() => {
    setPageNumber(1);
  }, [activeYear, contributorIdFilter]);

  const contributorById = useMemo(() => {
    const map = new Map<number, Contributor>();

    for (const contributor of contributors.data?.items ?? []) {
      map.set(contributor.id, contributor);
    }

    return map;
  }, [contributors.data]);

  const contributorOptions = useMemo(() => {
    return (contributors.data?.items ?? []).slice().sort((left, right) => left.name.localeCompare(right.name, "es"));
  }, [contributors.data]);

  const activeContributorOptions = useMemo(() => {
    return contributorOptions.filter((contributor) => contributor.status === 1);
  }, [contributorOptions]);

  const hasActiveFilters = contributorIdFilter !== null;

  const openCreateModal = () => {
    if (!canMutateCurrentPeriod) {
      toast.info(contributionRestrictionMessage ?? "No puedes editar este período.");
      return;
    }

    setEditState({ contribution: null, open: true });
  };

  const openEditModal = (contribution: Contribution) => {
    const contributorStatus = contributorById.get(contribution.contributorId)?.status;

    if (!canMutateCurrentPeriod) {
      toast.info(contributionRestrictionMessage ?? "No puedes editar este período.");
      return;
    }

    if (contributorStatus === 0) {
      toast.info("Contribuidor inactivo: este aporte no es editable.");
      return;
    }

    setEditState({ contribution, open: true });
  };

  const handleSave = async (payload: ContributionPayload) => {
    setSubmitting(true);

    const response = editState.contribution
      ? await api.put<Contribution>(`/api/contributions/${editState.contribution.id}`, payload)
      : await api.post<Contribution>("/api/contributions", payload);

    setSubmitting(false);

    if (!response.ok) {
      toast.error(response.error.detail);
      return;
    }

    toast.success(editState.contribution ? "Aporte actualizado." : "Aporte registrado.");
    setEditState({ contribution: null, open: false });
    invalidateResources(RESOURCE_KEYS.contributions, RESOURCE_KEYS.summary);
  };

  const handleDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    setDeleting(true);

    const response = await api.delete<Contribution>(`/api/contributions/${pendingDelete.id}`);

    setDeleting(false);

    if (!response.ok) {
      toast.error(response.error.detail);
      return;
    }

    toast.success("Aporte desactivado.");
    setPendingDelete(null);
    invalidateResources(RESOURCE_KEYS.contributions, RESOURCE_KEYS.summary);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 shadow-inner">
            <ReceiptText size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Listado de Aportes</h2>
          </div>
        </div>

        <Button
          icon={Plus}
          onClick={openCreateModal}
          disabled={!canMutateCurrentPeriod}
          className="w-full shadow-md shadow-primary-200 sm:w-auto"
        >
          Nuevo Aporte
        </Button>
      </header>

      <Card className="p-4" bodyClassName="p-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Filtros</p>
              <p className="mt-1 text-sm text-slate-500">Refina el listado por contribuidor y limpia el contexto actual cuando haga falta.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {hasActiveFilters ? (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={X}
                  onClick={() => setContributorIdFilter(null)}
                  className="justify-center"
                >
                  Limpiar filtros
                </Button>
              ) : null}
              <Button
                variant="outline"
                size="sm"
                icon={Filter}
                onClick={() => setFiltersOpen((previous) => !previous)}
                className="justify-center sm:min-w-[140px]"
              >
                {filtersOpen ? "Ocultar filtros" : "Más filtros"}
              </Button>
            </div>
          </div>

          {filtersOpen ? (
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <Select
                label="Filtrar por Contribuidor"
                value={contributorIdFilter ?? ""}
                onChange={(event) => setContributorIdFilter(event.target.value ? Number(event.target.value) : null)}
              >
                <option value="">Todos los contribuidores</option>
                {contributorOptions.map((contributor) => (
                  <option key={contributor.id} value={contributor.id}>
                    {contributor.name}
                  </option>
                ))}
              </Select>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Año activo:</span> {activeYear}
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      {contributions.loading && !contributions.data ? <SectionLoader label="Cargando aportes..." /> : null}
      {contributions.error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800 animate-in fade-in">
          No se pudo cargar el listado: {contributions.error}
        </div>
      ) : null}

      {contributions.data ? (
        <Card
          bodyClassName="p-0"
          footer={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Página {contributions.data.pagination.number} de {Math.max(1, contributions.data.pagination.totalPages || 1)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={ChevronLeft}
                  onClick={() => setPageNumber((previous) => Math.max(1, previous - 1))}
                  disabled={!contributions.data.pagination.hasPrevPage}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={ChevronRight}
                  iconPosition="right"
                  onClick={() => setPageNumber((previous) => previous + 1)}
                  disabled={!contributions.data.pagination.hasNextPage}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-3 p-4 sm:hidden">
            {contributions.data.items.map((item) => {
              const contributor = contributorById.get(item.contributorId);

              return (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                          {item.contributorName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900">{item.contributorName}</p>
                          {contributor ? (
                            <div className="mt-1">
                              <ContributorStatusBadge status={contributor.status} />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                      {formatPeriodLabel(item.month, item.year)}
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 px-3 py-3 text-sm">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Monto</p>
                    <p className="mt-1 font-extrabold text-slate-900">{formatCentsAsCurrency(item.amountCents)}</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit2}
                      onClick={() => openEditModal(item)}
                      disabled={!canMutateCurrentPeriod || contributor?.status === 0}
                      className="flex-1"
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      icon={Trash2}
                      onClick={() => setPendingDelete(item)}
                      disabled={!canMutateCurrentPeriod || contributor?.status === 0}
                      className="flex-1"
                    >
                      Desactivar
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">Contribuidor</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">Período</th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-600">Monto</th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contributions.data.items.map((item) => {
                  const contributor = contributorById.get(item.contributorId);

                  return (
                    <tr key={item.id} className="group transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                            {item.contributorName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold leading-none text-slate-900">{item.contributorName}</span>
                            {contributor ? (
                              <div className="mt-1">
                                <ContributorStatusBadge status={contributor.status} />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                          {formatPeriodLabel(item.month, item.year)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-slate-900">{formatCentsAsCurrency(item.amountCents)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Edit2}
                            onClick={() => openEditModal(item)}
                            disabled={!canMutateCurrentPeriod || contributor?.status === 0}
                            aria-label="Editar aporte"
                          />
                          <Button
                            size="sm"
                            variant="danger"
                            icon={Trash2}
                            onClick={() => setPendingDelete(item)}
                            disabled={!canMutateCurrentPeriod || contributor?.status === 0}
                            aria-label="Eliminar aporte"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      <ContributionModal
        open={editState.open}
        contributors={activeContributorOptions}
        monthlyAmountCents={settings.monthlyAmountCents}
        defaultYear={activeYear}
        defaultMonth={getCurrentBusinessMonth()}
        initialContribution={editState.contribution}
        lockedReason={canMutateCurrentPeriod ? null : contributionRestrictionMessage}
        submitting={submitting}
        onClose={() => setEditState({ contribution: null, open: false })}
        onSubmit={handleSave}
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Desactivar aporte"
        description={
          pendingDelete
            ? `Se desactivará el aporte de ${pendingDelete.contributorName} (${formatPeriodLabel(pendingDelete.month, pendingDelete.year)}).`
            : ""
        }
        confirmLabel="Desactivar"
        danger
        loading={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </div>
  );
};
