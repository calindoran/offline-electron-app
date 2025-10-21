"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const createWindow = () => {
    const win = new electron_1.BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js') // optional
        }
    });
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173');
    }
    else {
        win.loadFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
};
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
