const {success, info, warning, error} = require('./printer.js')
const {exit} = require('process');

const staging_general_channel = '792798572796968963'
const production_bot_testing_channel = '671084731235958804'

async function self_test(client) {
    let channel = process.env.ENV == 'staging' ? 
        await client.channels.fetch(staging_general_channel) : 
        await client.channels.fetch(production_bot_testing_channel)

    try{
        for(let cmd_name in client.commands)
        {
            let cmd = client.commands[cmd_name]
            if(cmd_name != 'test' && cmd_name != 'addimagecommand' && cmd_name != 'samisretarded')
            {
                info(`Testing: ${cmd_name}`);
                await channel.send(await cmd.get_response({}));
            }
        }
    } catch(e)
    {
        error(`Test failed with error: ${e}`)
        exit(1)
    }

    success("Tests passed.")
    exit(0);
}

module.exports = {
    self_test,
}