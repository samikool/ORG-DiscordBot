const red = "\x1b[31m"
const yellow = "\u001b[33m"
const white = "\u001b[37m"
const green = "\u001b[32m"

function info(str){
    console.info(`${white}[INFO] ${str}`);
}

function success(str){
    console.info(`${green}[SUCCESS] ${white}${str}`);
}

function warning(str){
    console.warn(`${yellow}[WARNING] ${white}${str}`);
}

function error(str){
    console.error(`${red}[ERROR] ${white}${str}`);
}

module.exports = {
    success,
    info,
    warning,
    error
}