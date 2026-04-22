export type BeforeInstallPromptChoice = {
  outcome: "accepted" | "dismissed";
  platform: string;
};

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<BeforeInstallPromptChoice>;
}

export const isStandaloneDisplayMode = (): boolean => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const standaloneNavigator = navigator as Navigator & { standalone?: boolean };

  return window.matchMedia("(display-mode: standalone)").matches || standaloneNavigator.standalone === true;
};

export const isAppleMobileDevice = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
};
