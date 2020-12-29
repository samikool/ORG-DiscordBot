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
                echo 'testing...'
            }
        }
        stage('Push to Staging'){
            when {
                not {branch 'staging'}
                not {branch 'production'}
            }
            steps{
                withCredentials([usernameColonPassword(credentialsId: 'Github-User-Token', variable: 'USERPASS')]) {
                    sh "git push origin origin/$BRANCH_NAME:staging"
                }
                }
        }
        stage('Deploy to staging'){
            when {
                branch 'staging'
            }
            steps{
                sh '/discordbot/scripts/staging-kill.sh'
                sh '/discordbot/scripts/staging-deploy.sh $BRANCH_NAME'
                sh '/discordbot/scripts/staging-start.sh'
            }
        }
        stage('Deploy to production'){
            when { 
                branch 'production'
            }
            steps {
                sh '/discordbot/scripts/production-deploy.sh'
            }
        }
    }
}