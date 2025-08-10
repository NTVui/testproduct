//Client
import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector('.chat .inner-form')
//console.log(formSendData)
if (formSendData) {
  formSendData.addEventListener('submit', (e) => {
    e.preventDefault()
    //console.log(e) Xem có value:"Nội dung nhập" ở ô input không
    const content = e.target.elements.content.value
    //console.log(content)
    if (content) {
      socket.emit('CLIENT_SEND_MESSAGE', content)
      e.target.elements.content.value = ''
      socket.emit("CLIENT_SEND_TYPING", "hidden")
    }
  })
}

// socket.on("SERVER_RETURN_MESSAGE", (data) => {
//     const myId = document.querySelector("[my-id]").getAttribute("my-id");
//     const body = document.querySelector(".chat .inner-body");

//     const div = document.createElement("div");

//     let htmlFullName = "";
//     if (myId == data.userId) {
//         div.classList.add("inner-outgoing");
//     } else {
//         div.classList.add("inner-incoming");
//         htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
//     }

//     div.innerHTML = `
//         ${htmlFullName}
//         <div class="inner-content">${data.content}</div>
//     `;

//     body.appendChild(div);

//});

//  Hàm escape HTML để tránh XSS
function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[
        tag
      ] || tag,
  )
}

//  Lắng nghe tin nhắn từ server
socket.on('SERVER_RETURN_MESSAGE', (data) => {
  const myId = document.querySelector('[my-id]').getAttribute('my-id')
  const body = document.querySelector('.chat .inner-body')
  const boxTyping = document.querySelector(".inner-list-typing")

  const div = document.createElement('div')

  let htmlFullName = ''
  if (myId == data.userId) {
    div.classList.add('inner-outgoing')
  } else {
    div.classList.add('inner-incoming')
    htmlFullName = `<div class="inner-name">${escapeHTML(data.fullName)}</div>`
  }

  div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${escapeHTML(data.content)}</div>
    `

  body.insertBefore(div, boxTyping)
  body.scrollTop = body.scrollHeight
  // //  Auto scroll mượt
  // setTimeout(() => {
  //     body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
  // }, 50);
})
//Scroll Chat to Bottom
const bodyChat = document.querySelector('.chat .inner-body')
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight
}

// //  Auto scroll khi load trang
// window.addEventListener("load", () => {
//     const body = document.querySelector(".chat .inner-body");
//     body.scrollTop = body.scrollHeight;
// });

//Emoji-picker
// document.querySelector('emoji-picker')
//   .addEventListener('emoji-click', event => console.log(event.detail));



//Show Typing
var timeOut
const showTyping = ()=>{
  //1. giây đầu chạy vào đây
    socket.emit("CLIENT_SEND_TYPING", "show")

    clearTimeout(timeOut)

    //2. chạy xuống đây ,mất 3s gửi lên
    //trong 3s vẫn đang gõ thì chạy lại vào keyup
    //chạy vào clearTimeout thì clear timeOut trước đó
    //Mỗi lần gõ thì clearTimeOut
    //hết gõ (ko chạy vào event keyup nữa) => còn skien setTimeOut cuối cùng
    timeOut = setTimeout(()=>{
      socket.emit("CLIENT_SEND_TYPING", "hidden")
    },3000)
}

//Show Popup
const buttonIcon = document.querySelector('.button-icon')
if (buttonIcon) {
  const tooltip = document.querySelector('.tooltip')
  Popper.createPopper(buttonIcon, tooltip)

  buttonIcon.onclick = () => {
    tooltip.classList.toggle('shown')
    
  }
}
//Insert icon to input
const emojiPicker = document.querySelector('emoji-picker')
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']",
  )
  emojiPicker.addEventListener('emoji-click', (event) => {
    const icon = event.detail.unicode
    //console.log(icon)
    inputChat.value = inputChat.value + icon

    //khi chèn icon vào thì luôn trỏ đến text cuối 
    const end = inputChat.value.length
    inputChat.setSelectionRange(end, end)
    inputChat.focus()
    showTyping()
  })

  inputChat.addEventListener("keyup", ()=>{
    showTyping()
  })
}

//SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing")
if(elementListTyping){
  socket.on("SERVER_RETURN_TYPING", (data) =>{
    //console.log(data)
    if(data.type == "show"){
      //Khi set setAttribute("user-id", data.userId) → luôn nhớ khi query lại phải dùng [user-id="..."]
    const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
    if(!existTyping){
      const boxTyping = document.createElement("div")
    boxTyping.classList.add("box-typing")
    boxTyping.setAttribute("user-id", data.userId)

    boxTyping.innerHTML =
      `<div class="box-typing">
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-dots">
          <span> </span>
          <span> </span>
          <span> </span>
        </div>
      </div>`
    elementListTyping.appendChild(boxTyping)
    bodyChat.scrollTop = bodyChat.scrollHeight
    
    }
    }else{
      const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);

      if(boxTypingRemove){
        elementListTyping.removeChild(boxTypingRemove)
      }
    }
})
}

//FileUploadWithPreview



 

