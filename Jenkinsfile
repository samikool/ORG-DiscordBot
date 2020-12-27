pipeline {
    agent any
    environment{
        CI = 'true'
    }
    options {
        skipStagesAfterUnstable()
    }
    stages {
        stage('Kill current bot'){
            steps{
                //sh /discordbot/scripts/kill.sh
            }
        }        
        stage('Build') {
            steps {
               "node --check *.js"
                npm install
            }
        }
        stage('Test'){
            steps{
                //eventually ill have a way to test

                //if pass
                git push origin:staging
            }
        }
        //deploys to test bot server
        stage('Deploy to staging'){
            when{
                //eventually this should be a if tests pass
                branch 'staging'
            }
            steps {
                sh /discordbot/scripts/staging-kill.sh
                sh /discordbot/scripts/staging-deploy.sh
                sh /discordbot/scripts/staging-start.sh
            }
        }
        stage('Deplay to production'){
            when { 
                branch 'production'
            }
            steps {
                sh /discordbot/scripts/production-deploy.sh
            }
        }
    }
}