export { };

declare global {
    interface Window {
        /** API to comunicate with Electron (PC app) */
        electronAPI: {
            /** @returns Promises the electron server address as `http://127.0.0.1:*` */
            getServerAddress: () => Promise<string>,
            /** @param like As `asleep` or `awake` — If `undefined` requests current display config @returns Promises current display config */
            requestDisplaySleep: (like?: string) => Promise<string>,
        };
        /** API to comunicate with Android */
        androidAPI: {
            /** @returns Android server address as `http://127.0.0.1:*` */
            getServerAddress: () => string,
            /** Makes JS request to show native message @param message Data to show in the Toast */
            showToast: (message: string) => void,            
        };
    }
}