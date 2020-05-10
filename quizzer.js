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
     * @param {}
     */
    isTakingQuiz(userID){
        return this.currentQuiztakers[userID] ? true : false;
    }

    /**
     * Function takes a userID and returns true if user is a quiztaker
     */
    isQuizTaker(userID){
        return this.quiztakers[userID] ? true : false;
    }
    
    addQuiztaker(){

    }

    removeQuiztaker(){

    }

    correctAnswer(userID){
        this.currentQuiztakers[userID].correct += 1;
        if(this.currentQuiztakers[userID].correct === 3){
            this.finishQuiz(userID)
        }else{
            this.client.users.cache.get(userID).send("Lucky bastard...")
            this.sendQuestion(userID)
        }
    }

    wrongAnswer(userID){
        this.client.users.cache.get(userID).send("Lmao you fucking retard... you actually got that wrong?")
        this.sendQuestion(userID)
    }

    finishQuiz(userID){
        this.client.users.cache.get(userID).send("Congrats you fucking aced the fuck out of that quiz!")
        this.currentQuiztakers[userID] = null;
    }

    /**
     * Takes userID and answer and checks if it correct
     * @param {*} userID 
     * @param {*} answer 
     */
    checkAnswer(userID, answer){
        if(this.currentQuiztakers[userID].question.answer === answer){
            this.correctAnswer(userID)
        }else{
            this.wrongAnswer(userID)
        }
    }

    /**
     * Take a userID and start giving them a quiz
     * @param {userID is the id of the user to give the quiz to} userID 
     */
    async startQuiz(userID){
        
        //need to get old roles and store
        //then restore on finish quiz

        this.currentQuiztakers[userID] = {
            question: null,
            correct: 0,
            firstQuestion: true,
        }
        this.sendQuestion(userID)
    }

    /**
     * Takes a userID and stores their question and sends it to them
     * @param {*} userID 
     */
    async sendQuestion(userID){
        let question = await this.getQuestionFromAPI();
        this.currentQuiztakers[userID].question = question;

        let message = '';
        if(this.currentQuiztakers[userID].firstQuestion){
            
            message += "Hey there it is time for your Quiz!" + 
            " Remember you did this to yourself and nobody else is to blame you silly piece of shit." + 
            " Have fun with your quiz, hope to talk to you soon!\n";
            
            this.currentQuiztakers[userID].firstQuestion = false;
        }
        message += "The category is " + this.currentQuiztakers[userID].question.category + "\n";

        if(this.currentQuiztakers[userID].question.type === 'boolean'){
            message += "True or False: ";
        }
        

        message += this.currentQuiztakers[userID].question.question + "\n"


        if(this.currentQuiztakers[userID].question.type === 'multiple'){
            let choices = this.currentQuiztakers[userID].question.choices;
            choices.push(this.currentQuiztakers[userID].question.answer)
            
            //This shit somehow randomly shuffles the array
            choices.sort(() => Math.random()- 0.5);
            message += "Choices: "
            choices.forEach((choice) => {
                message += '\''+choice+"\', ";
            })
        }

        this.client.users.cache.get(userID).send(message)

    }

    async getQuestionFromAPI () {
        let resp = await fetch("https://opentdb.com/api.php?amount=1",);
        resp = await resp.json();
        let questionObj = resp.results[0];
        
        questionObj.question = questionObj.question.replace(/&#039;/g, "\'");
        questionObj.question = questionObj.question.replace(/&quot;/g, "\"");
        questionObj.correct_answer = questionObj.correct_answer.replace(/&#039;/g, "\"");
        questionObj.correct_answer = questionObj.correct_answer.replace(/&quot;/g, "\"");
        questionObj.incorrect_answers.forEach((inc_answer,i) => {
            questionObj.incorrect_answers[i] = inc_answer.replace(/&#039;/g, "\"");
            questionObj.incorrect_answers[i] = inc_answer.replace(/&quot;/g, "\"");
        })

        console.log(questionObj)

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