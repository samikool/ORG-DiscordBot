require('dotenv').config()

const connectionInfo = {
    host: "localhost",
    user: process.env.dbname,
    password: process.env.dbpass,
    database: "discordbot"
}

const mariadb = require('mariadb')
const db = mariadb.createPool(connectionInfo)

async function query(query_str, values){
    try{
        if(values) return await db.query(query_str, values)
        else return await db.query(query_str)
    }
    catch(e){
        printSqlError(e)
        return false
    }
}

async function insertCommand(name, category, description, response){
    const query_str = `INSERT INTO command (name, category, description, response) VALUES(?,?,?,?)`
    const values = [name, category, description, response]
    return await query(query_str, values)
}

async function insertImage(commandID, path, file){
    const query_str = `INSERT INTO image (commandID, path, file) VALUES(?,?,?)`
    const values = [commandID, path, file]
    return await query(query_str, values)
}

async function insertAction(commandID){
    const query_str = `INSERT INTO action (commandID) VALUES(?)`
    const values = [commandID]
    return await query(query_str, values)
}

async function insertLink(commandID, link){
    const query_str = `INSERT INTO link (commandID, link) VALUES(?,?)`
    const values = [commandID, link]
    return await query(query_str, values)
}

async function insertText(commandID, text){
    const query_str = `INSERT INTO text (commandID, text) VALUES(?,?)`
    const values = [commandID, text]
    return await query(query_str, values)
}

async function getAllCommands(){
    const query_str = `SELECT * from command`
    return await query(query_str)
}

async function getCommandByName(name){
    const query_str = `SELECT * from command WHERE name='${name}'`
    return await query(query_str)
}

async function getCommandIDByName(name){
    const query_str = `SELECT ID from command WHERE name='${name}'`
    return await query(query_str)
}

async function getCommandType(command){
    const query_str = `SELECT type from command WHERE id='${command}'`
    return await query(query_str)
}

async function getImageByCommandID(commandID){
    const query_str = `SELECT * FROM image WHERE commandID='${commandID}'`
    return await query(query_str)
}

async function getTextByCommandID(commandID){
    const query_str = `SELECT * FROM text WHERE commandID='${commandID}'`
    return await query(query_str)
}

async function getLinkByCommandID(commandID){
    const query_str = `SELECT * FROM link WHERE commandID='${commandID}'`
    return await query(query_str)
}


async function getCommandByResponse(response){
    const query_str = `SELECT * FROM command WHERE id='${response}'`
    return await query(query_str)
}

function close(){
    db.end()
}

function printSqlError(e){
    console.error(e.sql)
    if(e.code === 'ER_DUP_ENTRY') 
        console.error('Attempted to insert duplicate entry')
    else if(e.code === 'ER_PARSE_ERROR')
        console.error('Error parsing SQL string')
    
    else if(e.code === 'ER_BAD_FIELD_ERROR')
        console.error('Attempted to read/insert value in column that does not exist')
    else if(e.code === 'ER_NO_SUCH_TABLE')
        console.error('Attempted to read/insert from non-existant table')
    else
        console.error(e)    
}

module.exports = {
    insertCommand,
    insertImage,
    insertAction,
    insertLink,
    insertText,
    getAllCommands,
    getCommandByName,
    getCommandIDByName,
    getCommandType,
    getImageByCommandID,
    getLinkByCommandID,
    getTextByCommandID,
}