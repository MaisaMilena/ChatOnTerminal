import Events from 'events'
import CliConfig from './src/cliConfig.js';
import TerminalController from "./src/terminalController.js";

// console.log('process.argv', process.argv);
const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);
console.log('config', config)
const componentEmitter = new Events();

const controller = new TerminalController();
await controller.initializeTable(componentEmitter);

