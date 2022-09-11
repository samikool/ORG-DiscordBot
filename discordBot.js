//TODO: Temp import of require will fix later on clean up for 1.0
import { createRequire } from 'module';
import { exit } from 'process';
import dotenv from 'dotenv'
import * as cmd_manager from './commandManager.js'
import * as print from './printer.js'

const require = createRequire(import.meta.url);
const {Client, Intents, REST, Routes} = require('discord.js');
const client = new Client({intents: 0xFFFF});
const rest = new REST({version: 10}).setToken(process.env.TOKEN)

dotenv.config()
cmd_manager.init("commands.json")

/**
 * Function is first event called by discordBot
 * Initializing stuff goes here
 */
client.on('ready', async function ()  {
    print.success(`Logged in as ${client.user.tag}!`);
    print.info("Registering commands...")

    if(await register_commands(cmd_manager.get_register_commands()))
    {
        print.error("Error registering commands...")
        exit(1)
    }
    print.success("Commands registered successfully.")
});

async function register_commands(commands) 
{
    // await rest.put(Routes.applicationCommands(process.env.BOT_ID), {body: commands});
    return 0;
}

async function run_test(msg)
{
    //test function will be implemented for real later
    let cmds = cmd_manager.get_register_commands();
    cmds = cmds.map(cmd => {return '!'+cmd.name})

    cmds.forEach(cmd => {
        print.info(`Testing: ${cmd}`)
        msg.channel.send(cmd);
    })

    return 0;
}

client.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()) return;

    let rsp = await cmd_manager.execute_command(interaction.commandName)
    interaction.reply(rsp)
});

client.on('messageCreate', async function(msg) {

    // if(msg.channel.type === 'text'){
    //     if(msg.content.includes("#")){
    //         msg.delete({reason: "Hashtags are not longer allowed to promote a safe and healthy discord enviornemnt."})
    //         msg.channel.send("Sorry hashtags are no longer allowed for your safety")
    //     }
    // }

    if (msg.content.startsWith('!')) {
        let cmd_name = msg.content.split(' ')[0]
        cmd_name = cmd_name.replace('!','')

        if(cmd_name == "test"){
            print.info("running tests")
            if(msg.author.id != '379844352714997761') 
            {
                console.log("User " + msg.author.name + " not authorized to test.")
                return
            }

            if(!await run_test(msg))
                return;
            else
                exit(1)
        }

        let resp = await cmd_manager.execute_command(cmd_name)
        if(resp) 
            msg.channel.send(resp);
        else
            print.warning(`Command: ${cmd_name} not found...`);
    }
})

client.on('error', (e) => {
    print.error(e)
})

client.on('shardError', (e, i) =>{
    print.error(i, e)
})

async function login(){
    try {
        await client.login(process.env.TOKEN)
    }
    catch(e) {
        console.log(e)
        console.log('retrying to connect...')
        setTimeout(login, 5000);
    }
}

login()