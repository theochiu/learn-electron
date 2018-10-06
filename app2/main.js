
// dependencies
const electron = require("electron");
const url = require("url");
const path = require("path");


// destructuring (pulls attributes (app, BrowserWindow) out of 
//electron (which was declared above))
const {app, BrowserWindow, Menu, ipcMain} = electron;

// create windows
let mainWindow;
let addWindow;

// Listen for app to be ready
app.on("ready", function(){
	// create new window

	// we created this variable up top
	mainWindow = new BrowserWindow({});	// pass in empty object 

	// load html into window
	mainWindow.loadURL(url.format({				// this takes attributes
		pathname: path.join(__dirname, "mainWindow.html"),		// passes the html file (needs this url)
		protocol: "file:",
		slashes: true
	}));

	// quit app when closed
	mainWindow.on("closed", function(){
		app.quit();
	});

	// build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// insert menu
	Menu.setApplicationMenu(mainMenu);
});

// createAddWindow function

function createAddWindow(){
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: "Add Shopping List Item"
	});

	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, "addWindow.html"),
		protocol: "file",
		slashes: true
	}));

	// garbage collection handle (need to release memory when the add window is closed)
	addWindow.on("close", function(){
		addWindow = null;
	});
}

// catch item:add
ipcMain.on("item:add", function(e, item){
	mainWindow.webContents.send("item:add", item);
});

// create menu template (menu bar at the top of the window)
const mainMenuTemplate = [		// this is an array
	
	{
		label:"File",
		submenu:[
			{
				label: "Add Item", 
				accelerator: process.platform == "darwin" ? "Command+N" :
				"Ctrl+N",
				click(){
					createAddWindow();	// calls function when that label is clicked
				}
			},
			{
				label: "Clear Items"
			},
			{
				label: "Quit", 
				accelerator: process.platform == "darwin" ? "Command+Q" :
				"Ctrl+Q",
				click(){
					app.quit();
				}
			}
		]
	}
];

// if mac, add empty object to menu
if (process.platform == "darwin") {
	mainMenuTemplate.unshift({});
	// unshift is an array method adds to beginning
}

// add dev tools item if not in production
if (process.env.NODE_ENV !== "production") {
	mainMenuTemplate.push({
		label: "Developer Tools",
		submenu: [
			{
				label: "Toggle dev tools",
				accelerator: process.platform == "darwin" ? "Command+I":
				"Ctrl+I",
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			}, 
			{
				role: "reload"
			}
		]
	});
}
