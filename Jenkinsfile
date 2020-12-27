pipeline {
    agent any
    environment{
        CI = 'true'
    }
    options {
        skipStagesAfterUnstable()
    }
    stages {   
        stage('Build') {
            steps {
                sh 'node --check *.js'
                sh 'npm install'
            }
        }
        stage('Test'){
            steps{
                //eventually ill have a way to test

                //if pass
                echo 'testing...'
            }
        }
        stage('Deploy to staging'){
            when{not{
                branch 'staging',
                branch 'production'
            }}
            steps{
                sh '/discordbot/scripts/staging-kill.sh'
                sh '/discordbot/scripts/staging-deploy.sh {$BRANCH_NAME}'
                sh '/discordbot/scripts/staging-start.sh'
            }
        }
        stage('Deplay to production'){
            when { 
                branch 'production'
            }
            steps {
                sh '/discordbot/scripts/production-deploy.sh'
            }
        }
    }
}