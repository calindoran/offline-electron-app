import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    performSync: (pendingMutations: any[]) => ipcRenderer.invoke('perform-sync', pendingMutations),
    on: (channel: string, cb: (...args: any[]) => void) => {
        ipcRenderer.on(channel, (_event, ...args) => cb(...args));
    }
});