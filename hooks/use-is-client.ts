import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** `false` durante o SSR/hidratação e `true` assim que o componente roda no navegador. */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
