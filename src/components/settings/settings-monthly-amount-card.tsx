import { Save, Settings } from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/fields";
import { SectionLoader } from "../ui/loaders";

type SettingsMonthlyAmountCardProps = {
  amountInput: string;
  loading: boolean;
  saving: boolean;
  onAmountChange: (value: string) => void;
  onRequestUpdate: () => void;
};

export const SettingsMonthlyAmountCard = ({
  amountInput,
  loading,
  saving,
  onAmountChange,
  onRequestUpdate
}: SettingsMonthlyAmountCardProps) => {
  return (
    <Card
      className="w-full border-primary-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(239,246,255,0.76))] shadow-card"
      bodyClassName="px-4 py-4 sm:px-6 sm:py-5"
      header={
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-primary-700" />
          Configuración Global
        </div>
      }
    >
      <div className="space-y-4">
        {loading ? (
          <SectionLoader label="Cargando..." />
        ) : (
          <>
            <p className="text-sm leading-6 text-neutral-600">
              Define el monto base mensual que se utiliza como referencia para el seguimiento operativo del periodo.
            </p>
            <Input
              label="Monto Base Mensual (USD)"
              type="text"
              inputMode="decimal"
              value={amountInput}
              onChange={(event) => onAmountChange(event.target.value)}
            />
            <Button icon={Save} onClick={onRequestUpdate} isLoading={saving} className="w-full">
              Actualizar Monto
            </Button>
          </>
        )}
      </div>
    </Card>

  );
};
