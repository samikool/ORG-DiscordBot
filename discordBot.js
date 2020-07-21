require('dotenv').config({path: __dirname+'/.env'})

const Discord = require('discord.js');
const fs = require('fs');
const moment = require("moment");
const fetch = require("node-fetch");
const Quizzer = require('./quizzer.js');
const client = new Discord.Client({autoReconnect:true});
 
let quizzer;

// const SAFE_SPACE_CHANNEL_ID = 247897731551592448;
// const DM_CHANNEL_ID = 671046362783154224

var question2 = "";
var answer = "";
var category = "";
var getvalues = [];
var newquestion = [];
var quizsent = '';

var QTmembers = "";
var accounts = [];
var values = [];
var firstquestion = true;


possibleCommands = [
    //tarkov
    '!reserve',
    '!interchange',
    '!shoreline',
    '!labs',
    '!factory',
    '!customs',
    '!woods',
    '!resort',
    '!dorms',
    '!labs',
    '!ammo',
    '!keys',
    '!hideout',
    '!questitems',
    //quiz
    '!quiz',
    '!quizme',
    //fun
    '!handitrey',
    '!jackiejthejackhammer',
    '!trey',
    '!ben',
    '!tickletime',
    '!samisretarded',
    '!bdawg',
    '!whattrey',
    //utils
    '!roll',
    '!ping',
    '!help'
]

//phrases go here
responses = {
    ben: "Actually his name is David",
    trey: "Fuck Trey",
}

//this gets current directory of the js file 
imagedirectory = fs.readdirSync(__dirname+'/images');

/**
 * Function is first event called by discordBot
 * Initializing stuff goes here
 */
client.on('ready', async function ()  {
    console.log(`Logged in as ${client.user.tag}!`);
    quizzer = new Quizzer(Discord, client);
    
    // const guild = client.guilds.cache.get("247897731551592448");
    // console.log(guild)
    //Checks for 5PM every hour
    setInterval(() => {
        if (checkTime2() == true) {
            quizsent = false;
        }
        if (quizsent == true) {
            //console.log("quizes already sent")
        } else {
            if (checkTime() == true) {
                startquiz();
                quizsent = true;
            }
        }
      }, 5000); // this is mesaured in milliseconds (15 seconds)
});

client.on('message', async function(msg) {
    //if message is from chat channel
    if (msg.channel.type === 'text' && msg.content.startsWith('!')) {
        var command = msg.content.toLowerCase().split(' ')[0];
        if (possibleCommands.includes(command)) {
            console.log("The command was " + command);
            command2 = command.substring(1);
            if (imagedirectory.includes(command2 + ".png")) {
                msg.channel.send({files: [__dirname+"/images/" + command2 + ".png"]});
            }else if(command == '!roll'){
                console.log("ROLLING!");
                var random = Math.random();
                console.log(random);
                if(random < 0.5){
                    msg.channel.send("Heads");
                }else{
                    msg.channel.send("Tails");
                }
            }else if(command == '!quiz'){
                quizzer.startQuiz(msg.mentions.members.first().id)
            }
            else if(command == '!samisretarded'){
                msg.channel.send('!handitrey')
                msg.channel.send('!whattrey')
            }
            else if(command == '!ping'){
                msg.channel.send('pong')
            }
            else if(command == '!help'){
                commands = '';
                for(i=0; i<possibleCommands.length; i++){
                    commands += possibleCommands[i];
                    if(i != possibleCommands.length){
                        commands += ', ';
                    }
                }
                console.log('Sending commands for ' + msg.author.username);
                msg.channel.send('Possible commands are: ' + commands);
            }  
            //this one has to be last
            else if (responses[command2] == responses[command2]) {
                msg.channel.send(responses[command2]);
            }
        }
    }else {
        //console.log(accounts)
        for (i = 0; i < accounts.length; i++) {
            if (msg.author.id == accounts[i].username) {
                if (msg.content.toLowerCase() == accounts[i].answer.toLowerCase()) {
                    accounts[i].correctQuestions++;
                    console.log("Number of questions correct is " + accounts[i].correctQuestions); 
                    firstquestion = false;

                    if (accounts[i].correctQuestions >= 3) {
                        client.users.cache.get(accounts[i].username).send("Congrats you fucking aced the fuck out of that quiz!");
                        const guild = client.guilds.cache.get("247897731551592448");
                        var member = guild.members.cache.get(accounts[i].username);
                        member.roles.add('708857911446601770');
                        member.roles.remove('296103466844028928');
                        member.voice.setMute(false);
                        accounts[i].correctQuestions = 0;
                    }else {
                        newquestion = await getNextQuestion();
                        //console.log(newquestion);
                        sendquestion = await createQuestionsForUsers(newquestion[0], newquestion[1], newquestion[2], accounts[i].correctQuestions, accounts[i].username);
                    }
                }
                else {
                    //console.log("Number of questions correct is " + accounts[i].correctQuestions)
                    firstquestion = false;
                    newquestion = await getNextQuestion();
                    //console.log(newquestion);
                    sendquestion = await createQuestionsForUsers(newquestion[0], newquestion[1], newquestion[2], accounts[i].correctQuestions, accounts[i].username);
                }
            };
        }
        //start of new quiz logic
        let userID = msg.author.id;
        if(quizzer.isTakingQuiz(userID)){
            quizzer.checkAnswer(userID, msg.content)
        }
    }
    //new if then to determine if it is an image or a phrase based on command entered
});

client.on('error', async function(error){
    console.log(error);
});

// ################################################# FUNCTIONS FOR THE QUIZ BOT ################################################

async function getNextQuestion () {
    try {
        await fetch("https://opentdb.com/api.php?amount=1").then((resp) => resp.json()).then(async function(data) {
            var obj = data.results[0];
            question = obj.question.replace(/&#039;/g, "\'");
            question2 = question.replace(/&quot;/g, "\"");
            answer = obj.correct_answer;
            category = obj.category;
            values = [category, question2, answer];
        })
    }
    catch {
        console.log("something went wrong here")
    }
    return values
}    
    
async function getQTMembers() {
    const guild = client.guilds.cache.get("247897731551592448");

    QTmembers = guild.roles.cache.get('708857911446601770').members.map(m=>m.user.id);
    //console.log(QTmembers);
    for (i = 0; i < QTmembers.length; i++) {
        var member = guild.members.cache.get(QTmembers[i]);
        member.roles.add("296103466844028928")
        member.roles.remove("708857911446601770")
        member.voice.setMute(true);
    }
}

async function createQuestionsForUsers(category, question, answer, correctQuestions, userid) {
    if (firstquestion == true) {
        for (i = 0; i < QTmembers.length; i++) {
            client.users.cache.get(String(QTmembers[i])).send("Hey there it is time for your Quiz! Remember you did this to yourself and nobody else is to blame you silly piece of shit. Have fun with your quiz, hope to talk to you soon!");
            accounts[i] = "quiztaker" + [i]
            accounts[i] = {
                username: String(QTmembers[i]),
                category: category,
                userquestion: question,
                answer: answer,
                correctQuestions: 0,
            };
            console.log("The first question if statmement happend")
            //Send the question to the user
            client.users.cache.get(accounts[i].username).send("The category is " + accounts[i].category + "\n" + "Question: " + accounts[i].userquestion);
        }
    } else if (firstquestion == false) {
        for (i = 0; i < accounts.length; i++) {
            console.log("The user id is " + userid);
            if (userid == accounts[i].username) {
                accounts[i] = {
                    username: userid,
                    category: category,
                    userquestion: question,
                    answer: answer,
                    correctQuestions: correctQuestions,
                };
                console.log("The question sent to a single person")
                //Send the question to the user
                client.users.cache.get(accounts[i].username).send("The category is " + accounts[i].category + "\n" + "Question: " + accounts[i].userquestion);
            }
        }
    }
}

async function startquiz() {
    getQTMembers();
    getvalues = await getNextQuestion();
    console.log(getvalues[0]);
    console.log(getvalues[1]);
    console.log(getvalues[2]);
    for (i = 0; i < QTmembers.length; i++) {
        sendquestion = await createQuestionsForUsers(getvalues[0], getvalues[1], getvalues[2]);
    }
}
// Checks for 5PM
function checkTime() {
    var currentTime = moment().format("HH:mm");
    var setTime = moment().format("17:00");
    if (currentTime >= setTime) {
        //console.log("Time has passed");
        return true
    } else if (currentTime <= setTime) {

        return false
    }
}

//Checks for 5AM
function checkTime2() {
    var currentTime = moment().format("HH:mm");
    var setTime = moment().format("05:00");
    if (currentTime <= setTime) {
        //console.log("Time has passed");
        return true
    } else if (currentTime >= setTime) {
        //console.log("Time has not occured yet");
        return false
    }
}

function login(){
    client.login(process.env.TOKEN)
    .then(() => {
    })
    .catch((e) => {
        console.log('retrying to connect...');
        setTimeout(login, 5000);
    });
}

login()



// ################################################### NOTES #########################################################


//Example of numbers needed
//user id = 703671948718112798
//discord server = 703672376109432892
//triggered shit lord channel = 703726754065547415
//quiz taker id = 704088583853572191




// use this to find out the id of a role in the discord server
    // var guild2 = client.guilds.cache.get("703672376109432892");
    // const role = guild2.roles.cache.find(guild2 => guild2.name === 'Quiz Takers');
    // console.log(role)
