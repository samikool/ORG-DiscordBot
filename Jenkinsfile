def getGitBranchName() {
    return scm.branches[0].name
}

pipeline {
    agent any
    environment{
        CI = 'true'
        GITHUB_TOKEN = credentials('github-user-token')
    }
    options {
        skipDefaultCheckout(true)
        skipStagesAfterUnstable()
    }
    stages {   
        stage('Clone') {
            steps {
                sh "rm -rf ./* .git .gitignore"
                sh "ls -lah"
                sh "git clone https://${GITHUB_TOKEN}@github.com/samikool/TarkovDiscordBot.git ."
                sh "git fetch --all"
                sh "git pull --all"
                sh "git checkout ${getGitBranchName()}"
            }
        }
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
                not {tag 'release-v*'}
            }
            steps{
                echo "${getGitBranchName()}"
                sh "git config user.email sam.morgan44@gmail.com"
                sh "git config user.name Jenkins"
                sh "git branch -a"
                sh "git checkout staging"
                sh "git merge ${getGitBranchName()}"
                sh "git commit --all -m \"jenkins merging ${getGitBranchName()} into staging\""
                sh "git push https://${GITHUB_TOKEN}@github.com/samikool/TarkovDiscordBot.git"
            }
        }
        stage('Deploy to staging'){
            when {
                branch 'staging'
            }
            steps{
                sh """
                    sudo npm run stop:staging --prefix /discordbot/staging/

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
                tag 'release-v*'
            }
            steps {
                sh """
                    sudo npm stop --prefix /discordbot/production/

                    sudo rm -rf /discordbot/production/*

                    sudo cp *.js *.json /discordbot/production/ -rf
                    sudo cp /discordbot/env/.env-production /discordbot/production/.env

                    sudo npm install --prefix /discordbot/production/

                    sudo npm run deploy --prefix /discordbot/production/
                """
            }
        }
    }
}