import { Check, Edit2, Mail, Plus, Trash2, Users } from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ContributorStatusBadge } from "../ui/state-badge";
import type { Contributor } from "../../types/domain";

type SettingsContributorsCardProps = {
  contributors: Contributor[];
  onCreateContributor: () => void;
  onEditContributor: (contributor: Contributor) => void;
  onToggleContributorStatus: (contributor: Contributor) => void;
};

export const SettingsContributorsCard = ({
  contributors,
  onCreateContributor,
  onEditContributor,
  onToggleContributorStatus
}: SettingsContributorsCardProps) => {
  return (
    <Card
      className="border-primary-200 bg-[var(--gradient-surface)] shadow-card dark:border-neutral-700"
      header={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-primary-700" />
              Lista de Contribuyentes
            </div>
            {/* Badge visible next to title on mobile, moved to right on desktop if needed */}
            <span className="rounded-full border border-primary-200 bg-[rgba(255,255,255,0.92)] px-2.5 py-1 text-[11px] font-bold text-neutral-600 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-300 sm:hidden">
              {contributors.length}
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-2 w-full sm:w-auto">
            <span className="hidden rounded-full border border-primary-200 bg-[rgba(255,255,255,0.92)] px-2.5 py-1 text-[11px] font-bold text-neutral-600 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-300 sm:inline-block">
              {contributors.length} registros
            </span>
            <Button size="sm" icon={Plus} onClick={onCreateContributor} className="w-full sm:w-auto">
              Nuevo contribuyente
            </Button>
          </div>
        </div>
      }
      bodyClassName="p-0"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-primary-50/60 dark:bg-primary-900/20">
            <tr>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Nombres</th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Estado</th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-white/5">
            {contributors.map((contributor) => (
              <tr key={contributor.id} className="group transition-colors hover:bg-primary-50/50 dark:hover:bg-primary-900/10">
                <td className="px-6 py-3.5">
                  <div>
                    <div className="font-bold leading-tight text-neutral-900 dark:text-neutral-100">{contributor.name}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                      <Mail size={10} />
                      {contributor.email ?? "Sin correo"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <ContributorStatusBadge status={contributor.status} />
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex flex-wrap justify-start gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit2}
                      onClick={() => onEditContributor(contributor)}
                      aria-label="Editar contribuyente"
                    />
                    <Button
                      size="sm"
                      variant={contributor.status === 1 ? "danger" : "secondary"}
                      icon={contributor.status === 1 ? Trash2 : Check}
                      onClick={() => onToggleContributorStatus(contributor)}
                      aria-label={contributor.status === 1 ? "Desactivar contribuyente" : "Activar contribuyente"}
                    >
                      {contributor.status === 1 ? "Desactivar" : "Activar"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

  );
};
