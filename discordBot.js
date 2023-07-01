//TODO: Temp import of require will fix later on clean up for 1.
require('dotenv').config();
const {exit} = require('process');
const {Client} = require('discord.js');

const {self_test} = require('./self_test.js');
const {get_command_by_name, init_commands} = require('./command_manager.js');
const {success, info, warning, error} = require('./printer.js');

const client = new Client({intents: 0xFFFF});
/**
 * Function is first event called by discordBot
 * Initializing stuff goes here
 */
client.on('ready', async function ()  {
    success(`Logged in as ${client.user.tag}!`);

    if(init_commands(client))
    {
        error("Error registering commands...");
        exit(1);
    }

    success("Commands registered successfully.");
    setInterval(heartbeat, 100)
    success("Started heartbeat.")
    
    if(process.argv[2] == "test")
    {
        self_test(client);
    }
});


client.on('interactionCreate', async interaction => {
    if(interaction.isAutocomplete())
    {
        const focusedValue = interaction.options.getFocused(true);       
        const cmd = get_command_by_name(interaction.commandName);
        const choices = await cmd.get_choices(focusedValue.name, focusedValue.value);

        try
        {
            await interaction.respond(choices);
        }
        catch(e)
        {
            error(`Error getting choices for: ${cmd.data.name}`)
            error(e);
        }
        return;
    }

    if(!interaction.isChatInputCommand())
        return;
    
    const cmd = get_command_by_name(interaction.commandName);
    if(!cmd) 
    {
        warning(`Tried to execute unregistered command: ${interaction.commandName}`);
        return;
    }

    info(`command: ${cmd.data.name}`);

    try
    {
        interaction.reply(await cmd.get_response(interaction));
    } 
    catch (e) { 
        await interaction.reply({content: "Error executing command", ephemeral: true});
        error(e);
    }
});

client.on('error', (e) => {
    error(e);
})

client.on('shardError', (e, i) =>{
    error(i, e);
})

async function heartbeat(){
    if(!client.isReady())
    {
        await login()
    }
}

async function login(){
    try {
        await client.login(process.env.TOKEN);
    }
    catch(e) {
        console.log(e);
        console.log('retrying to connect...');
        setTimeout(login, 5000);
    }
}

login();