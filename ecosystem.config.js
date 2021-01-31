let name = 'discordBot'
if(process.env.NODE_ENV === "staging") name += '-' + process.env.NODE_ENV

module.exports = {
  apps : [{
    name: name,
    script: './discordBot.js',
    env:{
      NODE_ENV: "production" 
      
    },
    env_staging:{
      NODE_ENV: "staging"
    },
    env_developement:{
      NODE_ENV: "development"
    }
  }],
}