import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { Button } from "./button";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = false,
  loading = false,
  onCancel,
  onConfirm
}: ConfirmModalProps) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={loading ? () => undefined : onCancel}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-900/32 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto p-4 md:p-8">
          <div className="flex min-h-full items-center justify-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-4 scale-95"
            >
              <DialogPanel className="w-full max-w-md overflow-hidden rounded-[var(--radius-dialog)] border border-border bg-[var(--gradient-dialog)] shadow-dialog transition-all dark:bg-neutral-800">
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
                      danger 
                        ? "border border-danger-300 bg-danger-100/70 text-danger-700 dark:border-danger-800 dark:bg-danger-900/30" 
                        : "border border-primary-200 bg-primary-50/80 text-primary-700 dark:border-primary-800 dark:bg-primary-900/30"
                    }`}>
                      {danger ? <AlertTriangle size={24} /> : <Info size={24} />}
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-extrabold text-neutral-900 tracking-tight dark:text-neutral-100">
                        {title}
                      </DialogTitle>
                      <p className="mt-2 text-sm text-neutral-500 leading-relaxed font-medium dark:text-neutral-400">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-border bg-[var(--gradient-modal-footer)] px-8 py-6 sm:flex-row-reverse">

                  <Button
                    variant={danger ? "danger" : "primary"}
                    onClick={onConfirm}
                    isLoading={loading}
                    className="sm:min-w-[120px]"
                  >
                    {confirmLabel}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    {cancelLabel}
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
