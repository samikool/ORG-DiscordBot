require('dotenv').config()


const {Client, Intents} = require('discord.js');
const Quizzer = require('./quizzer.js');

const client = new Client({intents: 0xFFFF});

const db = require('./database')

const fs = require('fs')
const pathh = require('path')
 
let quizzer;

/**
 * Function is first event called by discordBot
 * Initializing stuff goes here
 */
client.on('ready', async function ()  {
    console.log(`Logged in as ${client.user.tag}!`);
    quizzer = new Quizzer(Client, client);
});

client.on('message', async function(msg) {

    // if(msg.channel.type === 'text'){
    //     if(msg.content.includes("#")){
    //         msg.delete({reason: "Hashtags are not longer allowed to promote a safe and healthy discord enviornemnt."})
    //         msg.channel.send("Sorry hashtags are no longer allowed for your safety")
    //     }
    // }

    let userID = msg.author.id;
    if(quizzer.isTakingQuiz(userID)) quizzer.checkAnswer(userID, msg.content)

    //if message is from chat channel
    if (msg.content.startsWith('!')) {
        let cname = msg.content.split(' ')[0]
        cname = cname.replace('!','')

        let cmd = await db.getCommandByName(cname);
        cmd = cmd[0]

        //command was not found
        if(!cmd) 
            return

        console.log('command: ' + cmd.name)

        if(cmd.response === 'image'){
            let image = await db.getImageByCommandID(cmd.id)
            image = image[0]
            
            msg.channel.send({files: [image.path]})
        }
        else if(cmd.response === 'image_folder')
        {
            let path = await db.getImageFolderByCommandID(cmd.id)
            path = path[0]
            
            path = pathh.resolve('/', 'discordbot', 'images', path.path)
            file_list = fs.readdirSync(path)

            let random =  Math.round(Math.random() * (file_list.length - 1))
            path = pathh.resolve(path, file_list[random])

            msg.channel.send({files: [path]})
        }
        else if(cmd.response === 'text'){
            let text = await db.getTextByCommandID(cmd.id)
            text = text[0]

            msg.channel.send(text.text)
        }
        else if(cmd.response === 'link'){
            let link = await db.getLinkByCommandID(cmd.id)
            link = link[0]

            msg.channel.send(link.link)
        }
        else if(cmd.response === 'action'){
            //these commands have dynamic responses for now I'll just hardcode what they do
            if(cmd.name === 'roll'){
                let random = Math.random()
                if(random < 0.5) 
                    msg.channel.send("Heads")
                else 
                    msg.channel.send("Tails")
            }
            else if(cmd.name === 'quiz'){
                if(msg.author.id === "658888119114006538"){
                    msg.channel.send("Sorry, we dont\'t allow people with the name Tim to quiz others.... :(");
                    msg.channel.send("Please be sure to file a complaint with our admins if this continues to be a problem.");
                }
                else if(msg.mentions.members.first().id === "379844352714997761" || msg.mentions.members.first().id === "247897498104889345")
                    msg.channel.send('You can\'t quiz them, they are better than you...')
                else
                    quizzer.startQuiz(msg.mentions.members.first().id)
            }
            else if(cmd.name == 'queuethemusic'){
                let channelID = await msg.guild.channels.fetchActiveThreads()
                console.log(channelID);
            }
            else if(cmd.name === 'help'){
                let commands = await db.getAllCommands()                
                commands = commands.map(cmd => {return '!'+cmd.name})

                let s = commands.join(', ')
                s = "Possible commands are: " + s

                msg.channel.send(s)
            }
            else if(cmd.name == 'test'){
                if(msg.author.id != '379844352714997761') 
                {
                    console.log("User " + msg.author.name + " not authorized to test.")
                    return
                }
                    
                let commands = await db.getAllCommands()
                commands = commands.map(cmd => {return '!'+cmd.name})

                commands.map(cmd => {
                    if(cmd == "!test" || cmd == "!quiz")
                        return
                    msg.channel.send(cmd)
                })
            }
        }
    }
})

client.on('error', (e) => {
    console.error(e)
})

client.on('shardError', (e, i) =>{
    console.error(i, e)
})

async function login(){
    try{
        await client.login(process.env.TOKEN)
    }catch(e){
        console.log(e)
        console.log('retrying to connect...')
        setTimeout(login, 5000);
    }
}

login()