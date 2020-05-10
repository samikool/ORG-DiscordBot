const SERVER_ID = "247897731551592448";
const QUIZ_TAKER_ROLE_ID = "708857911446601770";
const TRIGGERED_SHIT_LORD_ROLE_ID = "296103466844028928";
const fetch = require("node-fetch");

class Quizzer{
    constructor(Discord, client){
        this.Discord = Discord;
        this.client = client
        this.quiztakers = {};
        this.currentQuiztakers = {};
        
        this.startUpdateQuiztakerInterval()
    }

    /**
     * Function sets intervald to store people in quiztaker role in the quiztakers map
     */
    async startUpdateQuiztakerInterval(){
        this.client.setInterval(async () => {
            let guild = await this.client.guilds.cache.get(SERVER_ID);
            guild.roles.cache.get(QUIZ_TAKER_ROLE_ID).members.forEach((user) => {
                this.quiztakers[user.id] = {};
            })
        }, 5000);
    }

    /**
     * Function takes a userID and returns true if user is taking quiz
     * @param {*} userID user id of user 
     */
    isTakingQuiz(userID){
        return this.currentQuiztakers[userID] ? true : false;
    }

    /**
     * Function takes a userID and returns true if user is a quiztaker
     * @param {*} userID user id of user
     */
    isQuizTaker(userID){
        return this.quiztakers[userID] ? true : false;
    }
    
    addQuiztaker(){

    }

    removeQuiztaker(){

    }

    /**
     * Takes userID and answer and checks if it correct
     * @param {*} userID 
     * @param {*} answer 
     */
    checkAnswer(userID, answer){
        if(this.currentQuiztakers[userID].question.answer.toLowerCase() === answer.toLowerCase()){
            this.correctAnswer(userID)
        }else{
            this.wrongAnswer(userID)
        }
    }

    /**
     * Function is called if user answered a question correctly 
     * If they answered 3 correctly it calls @finishQuiz to restore their permissions and end the quiz
     * If not it calls @sendQuestion to send them another question
     * @param {} userID 
     */
    correctAnswer(userID){
        this.currentQuiztakers[userID].correct += 1;
        if(this.currentQuiztakers[userID].correct === 3){
            this.finishQuiz(userID)
        }else{
            this.client.users.cache.get(userID).send("Lucky bastard...")
            this.sendQuestion(userID)
        }
    }

    /**
     * Function is called if the user incorrectly answered a question
     * They will be insulted and then sent another question
     * @param {*} userID 
     */
    wrongAnswer(userID){
        this.client.users.cache.get(userID).send("Lmao you fucking retard... you actually got that wrong?")
        this.sendQuestion(userID)
    }

    /**
     * Takes a userID and calls the functions necessary to start giving them a quiz
     * @param {*} userID is the user id of the user
     */
    startQuiz(userID){
        //set up current quiztaker object
        this.currentQuiztakers[userID] = {
            question: null,
            correct: 0,
            firstQuestion: true,
        }
        //remove their permissions
        this.takePermissions(userID);
        //give them the testtaker permissions
        this.giveTestPermissions(userID);
        //semd them a question
        this.sendQuestion(userID)
    }

    /**
     * Function takes a userID and 
     * @param {*} userID is the user id of the user 
     */
    finishQuiz(userID){
        //restire their permissions
        this.restorePermissions(userID);
        //congradulate/insult them
        this.client.users.cache.get(userID).send("Congrats you fucking aced the fuck out of that quiz!")
        //remove them from currentquizztaker map
        delete this.currentQuiztakers[userID]
    }

    /**
     * Function takes a userID and saves the users current roles and then takes them away
     * @param {*} userID 
     */
    takePermissions(userID){
        //get member
        let member = this.client.guilds.resolve(SERVER_ID).members.cache.get(userID);
        //get their roles (string of role id)
        let roles = member._roles;
        //save roles
        this.currentQuiztakers[userID].roles = roles;
        //for each role remove it
        roles.forEach((role) => {
            member.roles.remove(role);
            
        })
    }

    /**
     * Function takes a userID and adds them to the triggered shit lord group and mutes them
     * @param {*} userID 
     */
    giveTestPermissions(userID){
        let member = this.client.guilds.resolve(SERVER_ID).members.cache.get(userID);
        member.roles.add(TRIGGERED_SHIT_LORD_ROLE_ID)
        member.voice.setMute(true);
    }

    /**
     * Function takes a userID and restores their permissions that were saved before the test was started 
     * @param {*} userID 
     */
    restorePermissions(userID){
        let member = this.client.guilds.resolve(SERVER_ID).members.cache.get(userID);

        //remove truggered shit lord
        member.roles.remove(TRIGGERED_SHIT_LORD_ROLE_ID)

        //restore old roles
        let oldRoles = this.currentQuiztakers[userID].roles;
        oldRoles.forEach((role) => {
            member.roles.add(role)
        })

        //unmute
        member.voice.setMute(false)
    }

    /**
     * Takes a userID and stores their question and then sends it to them
     * @param {*} userID 
     */
    async sendQuestion(userID){
        let question = await this.getQuestionFromAPI();
        this.currentQuiztakers[userID].question = question;

        //start with empty message
        let message = '';

        //if their first question add an introduciton
        if(this.currentQuiztakers[userID].firstQuestion){
            
            message += "Hey there it is time for your Quiz!" + 
            " Remember you did this to yourself and nobody else is to blame you silly piece of shit." + 
            " Have fun with your quiz, hope to talk to you soon!\n";
            
            this.currentQuiztakers[userID].firstQuestion = false;
        }

        //either way add the category
        message += "The category is " + this.currentQuiztakers[userID].question.category + "\n";

        //if true of false add this at start of question
        if(this.currentQuiztakers[userID].question.type === 'boolean'){
            message += "True or False: ";
        }
        
        //of course add the question
        message += this.currentQuiztakers[userID].question.question + "\n"

        //if question type is multiple add the choices
        if(this.currentQuiztakers[userID].question.type === 'multiple'){
            let choices = this.currentQuiztakers[userID].question.choices;
            choices.push(this.currentQuiztakers[userID].question.answer)
            
            //This shit somehow randomly shuffles the array
            choices.sort(() => Math.random()- 0.5);
            message += "Choices: "

            //this adds quotes around the choices to make them more clear - some were printing weirdly
            choices.forEach((choice) => {
                message += '\''+choice+"\', ";
            })
        }

        this.client.users.cache.get(userID).send(message)

    }

    /**
     * This question gets a question fro the API and then returns it
     * @returns {
     * category: ,          category of question
     * type: ,              type of question
     * difficulty: ,        difficulty of question
     * question: ,          question 
     * answer: ,            answer
     * choices: ,           choice
     * }
     */
    async getQuestionFromAPI () {
        let resp = await fetch("https://opentdb.com/api.php?amount=1",);
        resp = await resp.json();
        let questionObj = resp.results[0];
        
        questionObj.question = questionObj.question.replace(/&#039;/g, "\'");
        questionObj.question = questionObj.question.replace(/&quot;/g, "\"");
        questionObj.correct_answer = questionObj.correct_answer.replace(/&#039;/g, "\'");
        questionObj.correct_answer = questionObj.correct_answer.replace(/&quot;/g, "\"");
        questionObj.incorrect_answers.forEach((inc_answer,i) => {
            questionObj.incorrect_answers[i] = inc_answer.replace(/&#039;/g, "\'");
            questionObj.incorrect_answers[i] = inc_answer.replace(/&quot;/g, "\"");
        })

        //console.log(questionObj)

        return {
            category: questionObj.category,
            type: questionObj.type,
            difficulty: questionObj.difficulty,
            question: questionObj.question,
            answer: questionObj.correct_answer,
            choices: questionObj.incorrect_answers,
        };
    }  

}

module.exports = Quizzer;