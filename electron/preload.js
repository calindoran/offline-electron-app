const { contextBridge, ipcRenderer } = require('electron');

/**
 * Preload script - runs in a privileged context with access to Node.js APIs
 * Best practices:
 * 1. Use contextBridge to expose specific APIs (not the whole ipcRenderer)
 * 2. Validate and sanitize all inputs
 * 3. Use invoke/handle pattern for async operations
 * 4. Don't expose the entire ipcRenderer or event objects
 */

// List of valid channels for security
const VALID_CHANNELS = {
  PERFORM_SYNC: 'perform-sync',
  CHECK_ONLINE_STATUS: 'check-online-status',
  GET_APP_INFO: 'get-app-info',
  TRIGGER_SYNC: 'trigger-sync',
  SYNC_STATUS: 'sync-status',
  SYNC_REQUESTED: 'sync-requested',
  // Add more valid channels here as needed
};

contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Perform sync operation
   * Uses invoke pattern for async operations (best practice)
   */
  performSync: (pendingMutations) => {
    // Validate input before sending to main process
    if (!Array.isArray(pendingMutations)) {
      return Promise.reject(new Error('pendingMutations must be an array'));
    }

    return ipcRenderer.invoke(VALID_CHANNELS.PERFORM_SYNC, pendingMutations);
  },

  /**
   * Check if the app is online
   */
  checkOnlineStatus: () => {
    return ipcRenderer.invoke(VALID_CHANNELS.CHECK_ONLINE_STATUS);
  },

  /**
   * Get app information
   */
  getAppInfo: () => {
    return ipcRenderer.invoke(VALID_CHANNELS.GET_APP_INFO);
  },

  /**
   * Listen for events from main process
   * Only exposes the callback, not the entire event object (security best practice)
   */
  on: (channel, callback) => {
    // Validate channel
    if (typeof channel !== 'string') {
      throw new Error('Channel must be a string');
    }

    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    // Only allow whitelisted channels
    const validChannels = Object.values(VALID_CHANNELS);
    if (!validChannels.includes(channel)) {
      throw new Error(`Channel "${channel}" is not whitelisted`);
    }

    // Use a wrapper to prevent exposing the event object
    const subscription = (_event, ...args) => callback(...args);
    ipcRenderer.on(channel, subscription);

    // Return unsubscribe function
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  /**
   * Remove event listener
   * Best practice: provide a way to clean up listeners
   */
  off: (channel, callback) => {
    if (typeof channel !== 'string') {
      throw new Error('Channel must be a string');
    }

    ipcRenderer.removeListener(channel, callback);
  },

  /**
   * Send one-way message to main process
   * Use sparingly - prefer invoke/handle pattern
   */
  send: (channel, ...args) => {
    if (typeof channel !== 'string') {
      throw new Error('Channel must be a string');
    }

    // Only allow whitelisted channels
    const validChannels = Object.values(VALID_CHANNELS);
    if (!validChannels.includes(channel)) {
      throw new Error(`Channel "${channel}" is not whitelisted`);
    }

    ipcRenderer.send(channel, ...args);
  },
});// Expose process information (optional, useful for debugging)
contextBridge.exposeInMainWorld('electron', {
  process: {
    platform: process.platform,
    versions: process.versions,
  },
});
