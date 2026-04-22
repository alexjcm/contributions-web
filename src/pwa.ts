import { toast } from "sonner";
import { registerSW } from "virtual:pwa-register";

let updateToastId: number | string | undefined;
let offlineReadyShown = false;

const clearUpdateToast = () => {
  if (updateToastId === undefined) {
    return;
  }

  toast.dismiss(updateToastId);
  updateToastId = undefined;
};

const updateSW = registerSW({
  onNeedRefresh() {
    if (updateToastId !== undefined) {
      return;
    }

    updateToastId = toast.info("Nueva version disponible.", {
      duration: Infinity,
      description: "Actualiza cuando te convenga. La aplicacion evita recargas automaticas para no interrumpir formularios o ediciones abiertas.",
      action: {
        label: "Actualizar",
        onClick: () => {
          clearUpdateToast();
          void updateSW(true);
        }
      },
      cancel: {
        label: "Luego",
        onClick: () => {
          clearUpdateToast();
        }
      },
      onDismiss: () => {
        updateToastId = undefined;
      }
    });
  },
  onOfflineReady() {
    if (offlineReadyShown) {
      return;
    }

    offlineReadyShown = true;
    toast.success("Modo offline listo.", {
      description: "La interfaz puede abrirse sin conexion, pero Auth0 y la API siguen requiriendo red."
    });
  },
  onRegisterError(error) {
    console.error("PWA registration failed.", error);
  }
});
