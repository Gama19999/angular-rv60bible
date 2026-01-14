export { };

declare global {
    interface Window {
        electron: {
            /** Retrieves the current server address and port */
            getServerAddress: () => Promise<string>,
        };
    }
}