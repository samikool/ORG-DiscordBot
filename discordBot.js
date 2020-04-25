const Discord = require('discord.js');
const client = new Discord.Client();

possibleCommands = ['!JackieJTheJackhammer', '!Trey', '!Ben', '!Reserve', '!Interchange', '!Shoreline', '!labs', 
'!Factory', '!Customs', '!Woods', '!Dorms', '!Resort', '!Labs', '!Ammo', 'Roll', '!Help']

client.once('ready', () => {
    console.log('Logged in as ' + client.user.tag);
});

client.on('message', async function(msg) {
    if(!msg.content.startsWith('!')){return;}


    var command = msg.content.toLowerCase().split(' ')[0];
    var arg = msg.content.toLowerCase().split(' ')[1];

    if(command == '!trey'){
        console.log('Fuck Trey')
        msg.channel.send('Fuck Trey');
    }
    else if(command == '!ben'){
        console.log('David');
        msg.channel.send('Actually his name is David');
    }
    else if(command == '!jackiejthejackhammer'){
        console.log('JackieJ');
        msg.channel.send({
            files: [{
                attachment: 'JackieJTheJackhammer.png' 
            }]
        })
    }
    else if(command == '!handitrey'){
        console.log('HandiTrey');
        msg.channel.send({
            files: [{
                attachment: 'handitrey.png'
            }]
        })
    }
    else if(command == '!whattrey'){
        console.log('whatTrey');
        msg.channel.send({
            files: [{
                attachment: 'whattrey.png'
            }]
        })
    }
    else if(command == '!bdawg'){
        console.log('Bdawg');
        msg.channel.send({
            files: [{
                attachment: 'bdawg.png'
            }]
        })
    }
    //Send Maps
    else if(command == '!reserve' || 
    command == '!interchange' ||
    command == '!shoreline' || 
    command == '!labs' ||
    command == '!factory' || 
    command == '!customs' || 
    command == '!woods' ||
    command == '!dorms' ||
    command == '!resort' 
    )
    {
        var map = msg.content.substring(1, msg.content.length);
        console.log('sending ' + map + ' map for ' + msg.author.username);
        msg.channel.send({
            files: [{
                attachment: './' + map + 'Map.png'
            }]
        })
        .catch(console.error);

    }
    //Send ammo chart
    else if(command == '!ammo'){
        console.log('sending ammo chart...');
        msg.channel.send({
            files: [{
                attachment: 'ammo.png'
            }]
        })
        .catch(console.error);
    }
    else if(command == '!roll'){
        console.log("ROLLING!");
        var random = Math.random();
        console.log(random);
        if(random < 0.5){
            msg.channel.send("Heads");
        }else{
            msg.channel.send("Tails");
        }
    }
    else if(command == '!quizme'){
        //console.log(msg.author.id)
        //console.log(msg)
        quiztaker = 379844352714997761 //Sam
        // quiztaker = 247897498104889345 //Ben
        // quiztaker = 247897365393047552 //Brandon
        // quiztaker = 253269487137062925 //Jackson 
        // quiztaker = 247906022004490241 //Trey
        if(msg.author.id == quiztaker){
            cantalk = await givequiz(quiztaker)
            console.log(msg.member.serverMute)
            console.log(msg.member.serverDeaf)
            msg.member.setMute(true)
            msg.member.setDeaf(true)
            //msg.author.memeber.setDeaf(true)
            if(cantalk){
                
            }else{

            }
        }
    }
    else if(command == '!quiz'){
        console.log(msg);
        console.log(msg.mentions.users.firstKey());
        userId = await msg.mentions.users.firstKey();
        user = await findUser(userId);
        user.setMute(true);
        user.setDeaf(true);
    }
    else{
        commands = '';
        for(i=0; i<possibleCommands.length; i++){
            commands += possibleCommands[i];
            if(i != possibleCommands.length){
                commands += ', ';
            }
        }
        console.log('Sending commands for ' + msg.author.username);
        msg.channel.send('Possible commands are: ' + commands)
    }
});

async function givequiz(id){

}

async function findUser(id){
    console.log(id)
    retUser = {}
    await client.users.forEach(user => {
        if(id == user.id){
            console.log('Found user')
            retUser = user.lastMessage.member;
        }
    });

    return retUser;
}

client.login('NjcxMDQ2MzYyNzgzMTU0MjI0.Xi3kjA.X8qP0_pafv_6oYgNRsBELUae9S4');
