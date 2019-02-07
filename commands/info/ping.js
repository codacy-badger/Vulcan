const Command = require("../../structures/classes/Command");

class Ping extends Command {
    constructor () {
        super({
            name: 'ping',
            aliases: ['pingpong', 'latency'],
            group: 'group2',
            description: 'Pings the bot and wait for a reply displaying the latency in ms.',
            examples: ['ping'],
            throttling: {
                usages: 2,
                duration: 10
            },
            args: {}
        });
    }

    async validate (message, hasValidArguments) {
        return hasValidArguments; // if true execute() will run
    }

    async execute (message) {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ping)}ms`);
    }
}

module.exports = Ping; 