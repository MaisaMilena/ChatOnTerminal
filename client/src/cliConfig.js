const PRODUCTION_URL = 'https://maisa-chat.herokuapp.com';

export default class CliConfig {
  
  constructor({username, room, hostUri = PRODUCTION_URL}){
    this.userName = username;
    this.room = room;
    const {hostname, port, protocol} = new URL(hostUri)
    this.host = hostname;
    this.port = port;
    this.protocol = protocol.replace(/\W/, '');
  }

  static parseArguments(commands){
    const cmd = new Map();

    for(const key in commands){
      const index = parseInt(key, 10);
      const command = commands[key];

      const commandPrefix = '--'
      if(!command.includes(commandPrefix)) continue;
      cmd.set(
        command.replace(commandPrefix, ''),
        commands[index + 1]
      )
    }
    return new CliConfig(Object.fromEntries(cmd));
  }
}