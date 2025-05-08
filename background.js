const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 800,
    minHeight: 800,
    maxHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, isDev ? 'electron/preload.js' : 'preload.js'),
      devTools: false
    },
    frame: false,
    resizable: false,
    transparent: false,
    backgroundColor: '#ffffff',
    useContentSize: true,
    autoHideMenuBar: true
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    // In production, load from the correct path
    const indexPath = path.join(process.resourcesPath, 'dist', 'index.html');
    console.log('Loading from path:', indexPath);
    mainWindow.loadFile(indexPath).catch(e => {
      console.error('Failed to load index.html:', e);
      console.log('Current directory:', __dirname);
      console.log('Resource path:', process.resourcesPath);
    });
  }

  // Log any page errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  // Handle window control messages
  ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
  });

  ipcMain.on('close-window', () => {
    mainWindow.close();
  });

  // Register global shortcut to show/hide calculator
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Prevent DevTools from being opened through keyboard shortcuts
  app.on('browser-window-created', (_, window) => {
    window.webContents.on('before-input-event', (event, input) => {
      if ((input.control || input.meta) && input.key.toLowerCase() === 'i') {
        event.preventDefault();
      }
    });
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
}); 