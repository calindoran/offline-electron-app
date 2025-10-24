const { app, BrowserWindow, ipcMain } = require('electron');
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

// Keep a global reference of the window object to prevent garbage collection
let mainWindow = null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // Security best practices
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // Explicitly disable for security
      contextIsolation: true, // Explicitly enable (default since Electron 12)
      sandbox: false, // Keep false if you need Node.js in preload
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    // Better window experience
    show: false, // Don't show until ready-to-show (prevents flashing)
  });

  // Show window when ready to prevent visual flash
  win.once('ready-to-show', () => {
    win.show();
  });

  // Open DevTools only in development
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Store reference
  mainWindow = win;

  // Handle window close
  win.on('closed', () => {
    mainWindow = null;
  });

  return win;
};

// Set up IPC handlers before creating windows
const setupIpcHandlers = () => {
  // Use handle/invoke pattern for async operations (best practice)
  ipcMain.handle('perform-sync', async (_event, pendingMutations) => {
    try {
      console.log('Performing sync with', pendingMutations.length, 'pending mutations');

      // Notify renderer that sync is starting
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('sync-status', {
          status: 'syncing',
          progress: 0,
          total: pendingMutations.length
        });
      }

      // Track results
      const results = {
        successful: [],
        failed: []
      };

      // Process each mutation
      for (let i = 0; i < pendingMutations.length; i++) {
        const mutation = pendingMutations[i];

        try {
          // In a real implementation, this would make API calls
          // For now, we'll simulate the sync operation
          console.log(`Processing mutation ${i + 1}/${pendingMutations.length}:`, {
            id: mutation.id,
            operation: mutation.operation,
            timestamp: mutation.timestamp
          });

          // Simulate network delay (remove in production)
          await new Promise(resolve => setTimeout(resolve, 100));

          results.successful.push(mutation.id);

          // Send progress update
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('sync-status', {
              status: 'syncing',
              progress: i + 1,
              total: pendingMutations.length
            });
          }
        } catch (error) {
          console.error(`Failed to sync mutation ${mutation.id}:`, error);
          results.failed.push({
            id: mutation.id,
            error: error.message
          });
        }
      }

      // Notify renderer of completion
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('sync-status', {
          status: 'completed',
          successful: results.successful.length,
          failed: results.failed.length
        });
      }

      const allSuccessful = results.failed.length === 0;

      return {
        success: allSuccessful,
        message: allSuccessful
          ? `Successfully synced ${results.successful.length} mutations`
          : `Synced ${results.successful.length} mutations, ${results.failed.length} failed`,
        data: {
          successful: results.successful,
          failed: results.failed,
          total: pendingMutations.length
        }
      };
    } catch (error) {
      console.error('Sync error:', error);

      // Notify renderer of error
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('sync-status', {
          status: 'error',
          error: error.message
        });
      }

      return {
        success: false,
        message: error.message || 'Unknown sync error',
        data: null
      };
    }
  });

  // Handler to check if online
  ipcMain.handle('check-online-status', async () => {
    // In Electron, we can check the network status
    // This is a simple check - you might want to ping your actual API
    return {
      online: true, // In main process, we assume online if this is called
      timestamp: Date.now()
    };
  });

  // Handler to get app info (useful for debugging)
  ipcMain.handle('get-app-info', async () => {
    return {
      version: app.getVersion(),
      name: app.getName(),
      platform: process.platform,
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node
    };
  });

  // Handler for triggering sync from main process (e.g., scheduled sync)
  ipcMain.on('trigger-sync', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('sync-requested');
    }
  });
};

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();

  // On macOS, re-create window when dock icon is clicked and no windows are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app quit
app.on('before-quit', () => {
  // Perform any cleanup here
  console.log('App is quitting...');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  // In production, you might want to send this to a logging service
});
