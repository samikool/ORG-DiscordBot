const {REST, Routes} = require('discord.js');
const rest = new REST({version: 10}).setToken(process.env.TOKEN);
const {success, info, warning, error} = require("./printer.js");
const fs = require('fs');

const commands = {};

function init_commands(client)
{
    load_commands(client);
    register_commands(client);
    init_cmd_dir_watch();
    init_img_dir_watch();
}

function load_commands(client)
{
    const command_files = fs.readdirSync(process.env.CMD_DIR).filter(file => 
        file.endsWith('.js') && file != 'command_helper.js'
    );

    for(const file of command_files) {
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

function init_cmd_dir_watch()
{
    fs.watch(process.env.CMD_DIR, 
        (event_type, file_name) => cmd_watch_callback(event_type, file_name)
    );
}

function init_img_dir_watch()
{
    fs.watch(process.env.IMG_DIR,
        (event_type, file_name) => img_watch_callback(event_type, file_name)
    );
}

function cmd_watch_callback(event_type, file_name)
{
    if(!file_name.endsWith('.js')) 
        return;

    let cmd_name = file_name.slice(0, -3);
    
    if(commands[cmd_name])
    {
        info(`Attempting to update: ${cmd_name}`);
        remove_command(cmd_name, file_name);
        add_command(file_name);
    }
    else
    {
        info(`Attempting to add new command: ${cmd_name}`);
        add_command(file_name);
        success(`${cmd_name} command added.`);
    }
    register_commands();
}

function remove_command(cmd_name, file_name)
{
    delete require.cache[require.resolve(`${process.env.CMD_DIR}${file_name}`)];
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
            || !command.get_response
            || !command.self_test
        )
        {
            throw new SyntaxError(
                `Command is malformed must have:\ndata: ${command.data}\nname: ${command.data.name}\ndescription: ${command.data.description}\nget_response: ${command.get_response}\nself_test: ${command.self_test}`
            );
        }
        commands[command.data.name] = command;
        success(`${command.data.name} command updated.`);
    } catch(e) {
        warning(`Unable to load command from ${file_name}`);
        warning(e);
    }
}

function img_watch_callback(event_type, file_name)
{
    if(event_type == 'change')
        return; //don't need to update if images changes
    
    add_img_command(file_name);
}

function add_img_command(file_name)
{
    const cmd_name = file_name.slice(0, -4);
    const file_string = get_img_command_file_string(cmd_name);
    info(`Attempting to add ${cmd_name} image command...`);
    fs.writeFileSync(`${process.env.CMD_DIR}${cmd_name}.js`, file_string);
    success(`Successfully added command for image: ${file_name}`);
}

function get_img_command_file_string(cmd_name)
{
    const s = `const {get_img_response, get_img_album_response, get_text_response,} = require('./command_helper.js')
const { SlashCommandBuilder } = require('discord.js');

async function self_test(channel){
    await channel.send(await get_response({}))
    return true;
}

async function get_response(interaction){
    return await get_img_response('${cmd_name}');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('${cmd_name}')
        .setDescription('...'),
    get_response,
    self_test,
};    
`;
    return s;
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
        cmd_list.push(commands[cmd].data);
    }
    return cmd_list;
}

module.exports = {
    init_commands,
    get_command_by_name,
}