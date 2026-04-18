import { Settings, ShieldAlert } from "lucide-react";

import { SettingsDialogsController } from "../components/settings/settings-dialogs-controller";
import { SettingsContributorsCard } from "../components/settings/settings-contributors-card";
import { SettingsMonthlyAmountCard } from "../components/settings/settings-monthly-amount-card";
import { Card } from "../components/ui/card";
import { SectionLoader } from "../components/ui/loaders";
import { APP_PERMISSIONS } from "../config/permissions";
import { useAppContext } from "../context/app-context";
import { useSettingsPageData } from "../hooks/use-settings-page-data";

export const SettingsPage = () => {
  const { permissionsLoaded, hasPermission } = useAppContext();
  const {
    settings,
    sortedContributors,
    amountInput,
    pendingAmountCents,
    setPendingAmountCents,
    handleAmountInputChange,
    requestMonthlyAmountUpdate
  } = useSettingsPageData();

  if (!permissionsLoaded) {
    return <SectionLoader label="Cargando permisos..." />;
  }

  if (!hasPermission(APP_PERMISSIONS.settingsWrite)) {
    return (
      <Card className="border-rose-200 bg-rose-50/30">
        <div className="flex items-center gap-3 text-rose-800">
          <ShieldAlert size={20} />
          <p className="text-sm font-bold uppercase tracking-wider">Acceso Restringido</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-rose-700">
          Esta sección está reservada para administradores. Se requiere el permiso{" "}
          <code className="rounded bg-rose-100 px-1.5 py-0.5 font-bold text-rose-900">{APP_PERMISSIONS.settingsWrite}</code> para realizar cambios en la configuración global.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Panel de Administración</h2>
          <p className="mt-1 text-sm text-slate-500">Configura el monto base y administra la lista de contribuyentes.</p>
        </div>
      </header>

      <SettingsDialogsController
        pendingAmountCents={pendingAmountCents}
        setPendingAmountCents={setPendingAmountCents}
        onSavingAmountChange={() => undefined}
        onEditContributor={() => undefined}
        onToggleContributorStatus={() => undefined}
        onOpenCreateContributor={() => undefined}
      >
        {({ openCreateContributorModal, requestContributorStatusChange, savingAmount, startEditingContributor }) => (
          <div className="grid gap-6 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
            <div className="space-y-6 xl:max-w-[360px]">
              <SettingsMonthlyAmountCard
                amountInput={amountInput}
                loading={settings.loading && !settings.data}
                saving={savingAmount}
                onAmountChange={handleAmountInputChange}
                onRequestUpdate={requestMonthlyAmountUpdate}
              />
            </div>

            <div>
              <SettingsContributorsCard
                contributors={sortedContributors}
                onCreateContributor={openCreateContributorModal}
                onEditContributor={startEditingContributor}
                onToggleContributorStatus={requestContributorStatusChange}
              />
            </div>
          </div>
        )}
      </SettingsDialogsController>
    </div>
  );
};
