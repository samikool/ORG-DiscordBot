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
                not {branch 'master'}
            }
            steps{
                withCredentials([usernamePassword(credentialsId: 'Github-User-Token', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        sh """
                            git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/samikool/TarkovDiscordBot.git HEAD:staging
                        """
                    }
                }
        }
        stage('Deploy to staging'){
            when {
                branch 'staging'
            }
            steps{
                sh """
                    sudo pm2 stop /discordbot/staging/ecosystem.config.js 1>/dev/null

                    sudo rm -rf /discordbot/staging/*

                    sudo cp *.js *.json /discordbot/staging/ -rf
                    sudo cp /discordbot/env/.env-staging /discordbot/staging/.env

                    sudo npm install --prefix /discordbot/staging/

                    sudo npm run deploy:staging --prefix /discordbot/staging/
                """
            }
        }
        stage('Deploy to production'){
            when { 
                branch 'production'
            }
            steps {
                sh """
                    sudo pm2 stop /discordbot/production/ecosystem.config.js 1>/dev/null

                    sudo rm -rf /discordbot/production/*

                    sudo cp *.js *.json /discordbot/production/ -rf
                    sudo cp /discordbot/env/.env-production /discordbot/production/.env

                    sudo npm install --prefix /discordbot/production/

                    sudo npm run deploy:production --prefix /discordbot/production/
                """
            }
        }
    }
}