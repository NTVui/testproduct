const Chat = require("../../models/chat-model")
module.exports  = async (res) =>{
    const userId = res.locals.user.id //middleware authen
    const fullName = res.locals.user.fullName

    //SocketIO

    //lưu ý bình thường là _io.on trên doccument của socketio
    //nhưng mỗi lần load lại trong database vẫn sẽ tạo thêm y như vậy
    // tức là cùng nội dung đó => load trang web => lưu lại rất nhiều bản
    // => google hỏi => dùng once
    _io.once('connection', (socket) =>{
    //console.log('a user connected', socket.id)
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
        // console.log(userId)
        // console.log(content)

        // sau này sửa ở trên async(data) và gọi data.image, data.content
        //Nhưng do hiện tại thư viện upload image t chưa tìm cách import dc
        //Sẽ tìm hiểu thư viện khác

        //Sau này còn thêm chức 
        //console.log(data)
        const chat = new Chat({
            user_id: userId,
            content: content
        })
        await chat.save()

        //Trả data về client
        _io.emit("SERVER_RETURN_MESSAGE",{
        userId: userId,
        fullName: fullName,
        content: content
    })
    })
    socket.on("CLIENT_SEND_TYPING", (type)=>{
        //console.log(type)
        socket.broadcast.emit("SERVER_RETURN_TYPING", {
            userId: userId,
            fullName: fullName,
            type: type
        })
    })
    })
}