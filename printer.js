const red = "\x1b[31m"
const yellow = "\u001b[33m"
const white = "\u001b[37m"
const green = "\u001b[32m"

export function success(str){
    print(str, "[SUCCESS]", green);
}

export function info(str){
    print(str, "[INFO]", white)
}

export function warning(str){
    print(str, "[WARNING]", yellow)
}

export function error(str){
    print(str, "[ERROR]", red)
}

function print(str, header, color){
    console.log(`${color}${header} ${white}${str}`)
}