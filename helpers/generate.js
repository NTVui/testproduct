module.exports.generateRandomString = (length)=>{
    const character = "ABCDEFGHIJKLMNOPQRSTUVWXZ1234567890"
    let result = ""
    for(let i = 0; i < length; i++){
        result+=character.charAt(Math.floor(Math.random()*character.length))
    }
    return result
}

module.exports.generateRandomNumber = (length)=>{
    const character = "1234567890"
    let result = ""
    for(let i = 0; i < length; i++){
        result+=character.charAt(Math.floor(Math.random()*character.length))
    }
    return result
}