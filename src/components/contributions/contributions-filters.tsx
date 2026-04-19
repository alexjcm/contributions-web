import { X } from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Select } from "../ui/fields";
import type { Contributor } from "../../types/domain";

type ContributionsFiltersProps = {
  contributorIdFilter: number | null;
  contributorOptions: Contributor[];
  hasActiveFilters: boolean;
  onChangeContributorFilter: (value: number | null) => void;
  onClearFilters: () => void;
};

export const ContributionsFilters = ({
  contributorIdFilter,
  contributorOptions,
  hasActiveFilters,
  onChangeContributorFilter,
  onClearFilters
}: ContributionsFiltersProps) => {
  return (
    <Card
      className="border-[rgba(37,99,235,0.24)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(239,246,255,0.5))] shadow-[0_16px_34px_rgba(37,99,235,0.07)]"
      bodyClassName="px-4 py-4 sm:px-6 sm:py-5"
    >
      <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="mt-3 flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-start">
            <label
              htmlFor="contributor-filter"
              className="shrink-0 text-sm font-semibold text-slate-700 md:min-w-[110px]"
            >
              Contribuyente
            </label>
            <div className="w-full md:w-[360px] lg:w-[420px]">
              <Select
                id="contributor-filter"
                value={contributorIdFilter ?? ""}
                onChange={(event) => onChangeContributorFilter(event.target.value ? Number(event.target.value) : null)}
                className="h-10 w-full"
              >
                <option value="">Todos los contribuyentes</option>
                {contributorOptions.map((contributor) => (
                  <option key={contributor.id} value={contributor.id}>
                    {contributor.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" icon={X} onClick={onClearFilters} aria-label="Limpiar filtro" className="self-start md:self-auto">
            Limpiar
          </Button>
        ) : null}
      </div>
    </Card>
  );
};
