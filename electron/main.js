const { app, BrowserWindow } = require('electron');
const path = require('path');

// Enable hot reload for main process in development mode
if (process.env.NODE_ENV === 'development') {
  try {
    require('electron-reloader')(module, {
      watchRenderer: false, // Don't watch renderer process since Vite handles that
      ignore: [/node_modules|[\/\\]\./, /dist|[\/\\]\./, /assets|[\/\\]\./]
    });
  } catch (_) {
    console.log('Error with electron-reloader');
  }
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js') // optional
    }
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});