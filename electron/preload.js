"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    performSync: (pendingMutations) => electron_1.ipcRenderer.invoke('perform-sync', pendingMutations),
    on: (channel, cb) => {
        electron_1.ipcRenderer.on(channel, (_event, ...args) => cb(...args));
    }
});
