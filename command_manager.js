const {REST, Routes} = require('discord.js');
const rest = new REST({version: 10}).setToken(process.env.TOKEN)
const {success, info, warning, error} = require("./printer.js");
const fs = require('fs');

const commands = {};

function init_commands(client)
{
    load_commands(client)
    register_commands(client)
}

function load_commands(client)
{
    // commands = JSON.parse(fs.readFileSync('commands.json'));
    const command_files = fs.readdirSync(process.env.CMD_DIR).filter(file => file.endsWith('.js') && file != 'command_helper.js');
    // info(command_files);

    for(const file of command_files)
    {
        const path = `${process.env.CMD_DIR}${file}`;
        const command = require(path);
        
        commands[command.data.name] = command;
    }
    client.commands = commands
}

async function register_commands()
{
    // info(JSON.stringify(commands))


    await rest.put(Routes.applicationGuildCommands(process.env.BOT_ID, process.env.SERVER_ID), {body: get_register_commands()});
    return 0;
}

function get_commands()
{
    return commands;
}

function get_command_by_name(cmd_name)
{
    return commands[cmd_name];
}

function get_register_commands()
{
    const cmd_list = [];
    for(const cmd in commands)
    {
        cmd_list.push(commands[cmd].data)
    }
    return cmd_list;
}

module.exports = {
    init_commands,
    get_command_by_name,
}