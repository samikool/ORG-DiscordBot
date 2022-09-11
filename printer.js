const red = "\x1b[31m"
const yellow = "\u001b[33m"
const white = "\u001b[37m"
const green = "\u001b[32m"

function success(str){
    print(str, "[SUCCESS]", green);
}

function info(str){
    print(str, "[INFO]", white)
}

function warning(str){
    print(str, "[WARNING]", yellow)
}

function error(str){
    print(str, "[ERROR]", red)
}

function print(str, header, color){
    console.log(`${color}${header} ${white}${str}`)
}

module.exports = {
    success,
    info,
    warning,
    error
}