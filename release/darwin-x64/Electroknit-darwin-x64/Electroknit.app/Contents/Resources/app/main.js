/* eslint strict: 0 */
'use strict';

const _ = require('underscore');
const Electroknit = require('electroknit');
const electron = require('electron');
const ipcMain = electron.ipcMain;

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const crashReporter = electron.crashReporter;
const shell = electron.shell;
const dialog = electron.dialog;
let pattern;

const client = {
  openPatternDialog: function(mainWindow) {
    const options = {
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'bmp'] },
      ]
    }
    electron.dialog.showOpenDialog(mainWindow, options, (files) => {
      if (!files) return; 
      pattern = new Electroknit.Pattern(files[0]);
      pattern.on('loaded', () => {
         mainWindow.webContents.send('update:pattern', pattern);
       });
    });
  }
}

crashReporter.start();

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

app.on('window-all-closed', () => {
  app.quit();
});


app.on('ready', () => {
  const machine = Electroknit.Machine.sharedMachine();

  let mainWindow = new BrowserWindow({ 
    width: 1024, 
    height: 728, 
    minWidth: 1024, 
    minHeight: 728 
  });


  ipcMain.on('machine:begin', () => {
    machine.start(pattern);
  });

  ipcMain.on('machine:stop', () => {
    machine.stop();
  });

  ipcMain.on('machine:detect', () => {
    machine.io.detect(() => {
      mainWindow.webContents.send('machine:detected', machine.io.ports.all);
    });
  });

  ipcMain.on('machine:connect', (e, arg) => {
    machine.io.connect(arg);
  });

  ipcMain.on('pattern:sync', (e, arg) => {
    _.extend(pattern, arg);
  });

  ipcMain.on('pattern:generate', (e, arg) => {
    _.extend(pattern, arg);
    pattern.render();
  });

  ipcMain.on('pattern:open', (e, arg) => {
    client.openPatternDialog(mainWindow);
  })

  machine.io.on('close', function() {
    if (mainWindow) {
      mainWindow.webContents.send('machine:close');
    }
  })

  machine.on('ready', function() {
    mainWindow.webContents.send('machine:ready', machine.io.ports.connection);
    mainWindow.webContents.send('machine:detected', machine.io.ports.all);
  })

  machine.on('update:sensors', function(data) {
    mainWindow.webContents.send('update:sensors', _.pick(machine, 'headDirection', 'stitch', 'currentRow'));
  });

  if (process.env.HOT) {
    mainWindow.loadURL(`file://${__dirname}/app/hot-dev-app.html`);
  } else {
    mainWindow.loadURL(`file://${__dirname}/app/app.html`);
  }

  mainWindow.on('closed', () => {
    machine.stop();
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

  if (process.platform === 'darwin') {
    const template = [{
      label: 'Electroknit',
      submenu: [{
        label: 'About Electroknit',
        selector: 'orderFrontStandardAboutPanel:'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: 'Hide Electroknit',
        accelerator: 'Command+H',
        selector: 'hide:'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        }
      }]
    }, {
      label: '&File',
      submenu: [{
        label: '&Open',
        accelerator: 'Ctrl+O',
        click() {
          client.openPatternDialog(mainWindow);
        }
      }, {
        label: '&Close',
        accelerator: 'Ctrl+W',
        click() {
          mainWindow.close();
        }
      }]
    }, {
      label: 'View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: 'Reload',
        accelerator: 'Command+R',
        click() {
          mainWindow.restart();
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Window',
      submenu: [{
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      }, {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:'
      }, {
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('https://github.com/kelly/electroknit-app');
        }
      }, {
        label: 'Documentation',
        click() {
          shell.openExternal('https://github.com/kelly/electroknit-app/blob/master/README.md');
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/kelly/electroknit-app/issues');
        }
      }]
    }];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } 
});