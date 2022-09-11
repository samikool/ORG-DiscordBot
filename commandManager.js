import * as print from './printer.js'
import fs from 'fs'

let commands = {}

export function init(cmd_file_name)
{
    load_commands(cmd_file_name);    
}

function load_commands(cmd_file_name)
{
    commands = JSON.parse(fs.readFileSync(cmd_file_name));
}

function get_commands(){
    return commands;
}

export function get_register_commands(){
    const reg_cmds = []
    for(var cmd_name in commands)
    {   
        const cmd = commands[cmd_name]
        reg_cmds.push(get_register_command(cmd))
    }
    return reg_cmds
}

function get_register_command(command){
    const reg_cmd = {...command}; //shallow copy
    delete reg_cmd.id;
    delete reg_cmd.category;
    delete reg_cmd.responseType;
    return reg_cmd;
}

export async function get_cmd_by_name(cmd_name)
{
    return commands[cmd_name];
}

export async function execute_command(cmd_name)
{
    let cmd = commands[cmd_name];
    print.info(`executing: ${cmd_name}`);

    if(!cmd) return;

    if(cmd.responseType === 'image'){
        let path = `/discordbot/images/${cmd_name}.png`;    
        return {files: [path]}
    }
    else if(cmd.responseType === 'image_folder')
    {
        let path = "/discordbot/images/"+cmd_name;    
        let file_list = fs.readdirSync(path)

        let random =  Math.round(Math.random() * (file_list.length - 1))
        path = `${path}/${file_list[random]}`;

        return {files: [path]};    
    }
    else if(cmd.responseType === 'text'){
        return cmd.response;
    }
    else if(cmd.responseType === 'link'){
        return cmd.response;
    }
    else if(cmd.responseType === 'action'){
        //these commands have dynamic responseTypes for now I'll just hardcode what they do
        if(cmd.name === 'roll'){
            let random = Math.random()
            if(random < 0.5) 
                return "Heads"
            else 
                return "Tails"
        }
        else if(cmd.name === 'help'){  
            let cmds = []
            for(let cmd in commands)
                cmds.push(commands[cmd])
            cmds = cmds.map(cmd => {return '!'+cmd.name})
            return `Possible commands are ${cmds.join(', ')}`
        }
    }
}