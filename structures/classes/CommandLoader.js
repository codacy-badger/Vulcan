const Command = require('./Command');
const fs      = require('fs');
const path    = require('path');

const RandomUtility      = require('../../modules/objects/RandomUtility');
const { _, performance } = require('perf_hooks');

let rootPath = path.dirname(require.main.filename)

class CommandLoader {
    constructor(vulcan) {
        this.vulcan      = vulcan;
        this.commandList = {};
    }

    loadCommands() {
        let commandsFolderPath = path.join(__dirname, "../../commands");
        const commands         = RandomUtility.getAllFiles(commandsFolderPath);

        for (let commandPath of commands) {
            let t       = performance.now();
            let matches = commandPath.match(/\w*.js/)
            let cmdName = matches[matches.length - 1].slice(0, -3);
            
            try {
                let fullPath     = path.join(rootPath, "commands", commandPath);
                let CommandClass = require(fullPath);
                
                let s               = `\\`;
                let firstOccurrence = commandPath.indexOf(s)
                let lastOccurrence  = commandPath.lastIndexOf(s);
                let CommandType     = commandPath.substring(firstOccurrence+1, lastOccurrence).replace(s, ".");
                

                let command = new CommandClass(CommandType);
                let keys    = [command.name, ...command.aliases];

                for (let key of keys) {
                    this.commandList[key] = command;
                }

                t = RandomUtility.round(performance.now() - t, 2);
                this.vulcan.logger.info(`Loaded command ${cmdName} from ${commandPath} (took ${t}ms)`);
            } catch(err) {
                this.vulcan.logger.error(`(${err.name}): ${err.message}`);
            }
        }

        return this.commandList;
    }
}

module.exports = CommandLoader;