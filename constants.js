//move constants into here if they change based on enviorment
const prod = {
    
}

const staging = {

}

const dev = {

}

exports.config = () => {
    if(process.env.NODE_ENV === 'development') return dev
    else if (process.env.NODE_ENV === 'staging') return staging
    else if (process.env.NODE_ENV === 'production') return prod
    return null
}