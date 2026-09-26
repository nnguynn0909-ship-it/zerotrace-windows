const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

let mainWindow = null;
const LIVE_URL = 'https://zeroclip-vn.pages.dev';
const LOCAL_HTML = path.join(__dirname, 'www', 'index.html');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 480,
    minHeight: 620,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    title: 'ZeroTrace - Zero-Trace Clipboard',
    autoHideMenuBar: true,
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      spellcheck: false
    }
  });

  // Remove default menu for sleek app feel
  Menu.setApplicationMenu(null);

  // Live Auto-Update: Load latest cloud web app, fallback to local file if offline
  mainWindow.loadURL(LIVE_URL).catch(() => {
    mainWindow.loadFile(LOCAL_HTML);
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    if (validatedURL && validatedURL.startsWith('http')) {
      mainWindow.loadFile(LOCAL_HTML);
    }
  });

  // Open external links in user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      if (!url.startsWith(LIVE_URL)) {
        shell.openExternal(url);
        return { action: 'deny' };
      }
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

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
