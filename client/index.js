#!/usr/bin/env node

/**
 *  chmod +x index.js
 * */

import Events from 'events'
import CliConfig from './src/cliConfig.js';
import SocketClient from './src/socket.js';
import TerminalController from "./src/terminalController.js";
import EventManager from './src/eventManager.js';

// console.log('process.argv', process.argv);
const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);
// console.log('config', config)

const componentEmitter = new Events();
const socketClient = new SocketClient(config);
await socketClient.initialize();

const eventManager = new EventManager({componentEmitter, socketClient});
const events = eventManager.getEvents();
socketClient.attachEvents(events);
const data = {
  roomId: config.room,
  userName: config.userName
}
console.log("Index: ", data);
eventManager.joinRoomAndWaitForMessages(data)

const controller = new TerminalController();
await controller.initializeTable(componentEmitter);

