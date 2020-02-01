const Discord = require('discord.js');
const client = new Discord.Client();

possibleCommands = ['!whattrey','!JackieJTheJackhammer', '!trey', '!ben', '!reserve', '!interchange', '!shoreline', '!labs', 
'!factory', '!customs', '!woods', '!dorms', '!resort', '!ammo', '!help']

client.once('ready', () => {
    console.log('Logged in as ' + client.user.tag);
});

client.on('message', msg => {
    if(!msg.content.startsWith('!')){return;}

    var command = msg.content.toLowerCase();

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

client.login('');

