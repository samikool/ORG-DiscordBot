let name = 'discordBot'
if(process.env.NODE_ENV === "staging") name += '-' + process.env.NODE_ENV

module.exports = {
  apps : [{
    name: name,
    script: 'discordBot.js',
    exp_backoff_restart_delay: 100,
    watch: true,
    watch_delay: 1000,
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