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
        stage('Push to staging'){
            when{not{
                branch 'staging'
            }}
            steps{


                withCredentials([usernamePassword(credentialsId:'Github', usernameVariable:'user', passwordVariable:'psw')]){
                    echo "${user}"
                    echo "${psw}"
                    sh 'git config --global user.name "${user}"'
                    sh 'git config --global user.password "{psw}"'
                    sh 'git checkout staging'
                    sh 'git merge ${BRANCH_NAME}'
                    //sh 'git commit -m "pushing ${BUILD_NUMBER} from ${BRANCH_NAME} to staging..."'
                
                sh 'git push origin'
                }
                
            }
        }

        //deploys to test bot server
        stage('Deploy to staging'){
            when{
                //eventually this should be a if tests pass
                branch 'staging'
            }
            steps {
                sh '/discordbot/scripts/staging-kill.sh'
                sh '/discordbot/scripts/staging-deploy.sh'
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