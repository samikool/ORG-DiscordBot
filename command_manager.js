const {REST, Routes} = require('discord.js');
const rest = new REST({version: 10}).setToken(process.env.TOKEN);
const {success, info, warning, error} = require("./printer.js");
const fs = require('fs');

const commands = {};

function init_commands(client)
{
    load_commands(client);
    register_commands(client);
    watch_cmd_dir();
    watch_img_dir();
}

function load_commands(client)
{
    const command_files = fs.readdirSync(process.env.CMD_DIR).filter(file => 
        file.endsWith('.js') && file != 'command_helper.js'
    );

    for(const file of command_files)
    {
        add_command(file, process.env.CMD_DIR);
    }
    client.commands = commands;
}

async function register_commands()
{
    await rest.put(Routes.applicationGuildCommands(process.env.BOT_ID, process.env.SERVER_ID), 
        {
            body: get_register_commands()
        }
    );
    return 0;
}

function watch_cmd_dir()
{
    fs.watch(process.env.CMD_DIR, 
        (event_type, file_name) => cmd_watch_callback(event_type, file_name)
    );
}

function watch_img_dir()
{
    fs.watch(process.env.IMG_DIR,
        (event_type, file_name) => img_watch_callback(event_type, file_name)
    );
}

function cmd_watch_callback(event_type, file_name)
{
    if(!file_name.endsWith('.js')) return;
    
    let cmd_name = file_name.slice(0, -3);
    if(commands[cmd_name])
    {   
        update_command(cmd_name, file_name);
    }
    else
    {
        add_command(file_name);
        register_commands();
    }
    success(`${cmd_name} command updated.`);
}

function remove_command(cmd_name, file_name)
{
    delete require.cache[`${process.env.CMD_DIR}${file_name}`];
    delete commands[cmd_name];
}

function add_command(file_name)
{
    try {
        const path = `${process.env.CMD_DIR}${file_name}`;
        const command = require(path);

        if(JSON.stringify(command) == '{}') {
            warning(`Nothing exported from file ${file_name}`);
            delete require.cache[path];
            return;
        }

        if(!command.data 
            || !command.data.name 
            || !command.data.description 
            || !command.get_response)
        {
            throw new SyntaxError(
                `Command is malformed must have: data: ${command.data} data.name: ${!command.data.name}, data,description: ${command.data.name}, and get_response: ${command.get_response} defined at a minimum`
            );
        }
        commands[command.data.name] = command;
    } catch(e) {
        warning(`Unable to load command from ${file_name}`);
        warning(e);
    }
}

function update_command(cmd_name, file_name)
{
    remove_command(cmd_name, file_name);
    add_command(file_name);
}

function img_watch_callback(event_type, file_name)
{
    if(event_type == 'change')
        return; //don't need to update anything on change
    add_img_command(file_name);
}

function add_img_command(file_name)
{
    const cmd_name = file_name.slice(0, -4);
    const file_string = get_img_command_file_string(cmd_name);
    fs.writeFileSync(`${process.env.CMD_DIR}${cmd_name}.js`, file_string);
}

function get_img_command_file_string(cmd_name)
{
    const s = `const {get_img_response, get_img_album_response, get_text_response,} = require('./command_helper.js')
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('${cmd_name}')
        .setDescription('...'),
    async get_response(interaction) {
        return await get_img_response('${cmd_name}');
    },
};
`;
    return s;
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