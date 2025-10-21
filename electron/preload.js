const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    performSync: (pendingMutations) => ipcRenderer.invoke('perform-sync', pendingMutations),
    on: (channel, cb) => {
        ipcRenderer.on(channel, (_event, ...args) => cb(...args));
    }
});