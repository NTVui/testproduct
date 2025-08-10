const Cart = require('../../models/cart-model')
const User = require('../../models/user-model')
const ForgotPassword = require('../../models/forgot-password-model')
const generateHelper = require('../../helpers/generate')
const sendMailHelper = require('../../helpers/sendMail')
const md5 = require('md5')

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render('client/pages/user/register', {
    pageTitle: 'Trang đăng ký',
  })
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  //console.log(req.body)
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  })
  if (existEmail) {
    req.flash('error', 'Email đã tồn tại')
    const redirectUrl = req.get('Referer')
    return res.redirect(redirectUrl)
  }
  req.body.password = md5(req.body.password)
  const user = new User(req.body)
  await user.save()
  //console.log(user)
  res.cookie('tokenUser', user.tokenUser)
  res.redirect('/')
}

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render('client/pages/user/login', {
    pageTitle: 'Trang đăng nhập',
  })
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  //console.log(req.body)
  const email = req.body.email
  const password = req.body.password
  const user = await User.findOne({
    email: email,
    deleted: false,
  })
  if (!user) {
    req.flash('error', 'Email không tồn tại')
    const redirectUrl = req.get('Referer')
    return res.redirect(redirectUrl)
  }
  if (md5(password) != user.password) {
    req.flash('error', 'Sai mật khẩu')
    const redirectUrl = req.get('Referer')
    return res.redirect(redirectUrl)
  }
  if (user.status == 'inactive') {
    req.flash('error', 'Tài khoản đang bị khóa')
    const redirectUrl = req.get('Referer')
    return res.redirect(redirectUrl)
  }
  res.cookie('tokenUser', user.tokenUser)

  //Lưu user_id vào collection carts
  console.log(user.id)
  console.log(req.cookies.cartId)
  await Cart.updateOne({
    _id: req.cookies.cartId
  },{
    user_id: user.id
  })
  res.redirect('/')
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie('tokenUser')
  res.redirect('/')
}
// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render('client/pages/user/forgot-password', {
    pageTitle: 'Lấy lại mật khẩu',
  })
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  //console.log(req.body.email)
  const email = req.body.email
  const user = await User.findOne({
    email: email,
    deleted: false,
  })
  if (!user) {
    req.flash('error', 'Email không tồn tại')
    const redirectUrl = req.get('Referer')
    return res.redirect(redirectUrl)
  }

  //1. Tạo mã OTP và lưu thông tin yêu cầu (OTP, email) vào collection forgot-password
  const otp = generateHelper.generateRandomNumber(8)
  const objectForgotPassword = {
    email: email,
    otp: otp,
    
  }
  const forgotPassword = new ForgotPassword(objectForgotPassword)
  await forgotPassword.save()
  //console.log(objectForgotPassword)

  //2. Gửi mã OTP qua email của user
  const subject = 'Mã OTP lấy lại mật khẩu'
  const html = `Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>. Thời hạn là 2 phút!`
  sendMailHelper.sendMail(email, subject, html)
  res.redirect(`/user/password/otp?email=${email}`)
}

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  res.render('client/pages/user/otp-password', {
    pageTitle: 'Nhập mã OTP',
    email: req.query.email,
  })
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email
  const otp = req.body.otp.toString().trim()

  console.log('=== DEBUG OTP ===')
  console.log('Email:', email)
  console.log('OTP từ form:', `'${otp}'`, 'Length:', otp.length)

  // Kiểm tra tất cả records cho email này
  const allRecords = await ForgotPassword.find({ email: email })
  console.log('Tất cả OTP trong DB:', allRecords)

  // Kiểm tra record cụ thể
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  })

  console.log('Kết quả tìm kiếm:', result)
  console.log('=== END DEBUG ===')

  if (!result) {
    req.flash('error', 'OTP không hợp lệ hoặc đã hết hạn')
    const redirectUrl = req.get('Referer')
    return res.redirect(redirectUrl)
  }

  await ForgotPassword.deleteOne({ _id: result._id })
  const user = await User.findOne({
    email: email,
  })

  res.cookie('tokenUser', user.tokenUser)
  res.redirect('/user/password/reset')
}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render('client/pages/user/reset-password', {
    pageTitle: 'Đổi mật khẩu',
  })
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password
  const tokenUser = req.cookies.tokenUser

  console.log(password)
  console.log(tokenUser)

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    },
  )
  res.redirect('/')
}

//[GET] /user/info
module.exports.info = async (req, res) => {
  res.render('client/pages/user/info', {
    pageTitle: 'Thông tin tài khoản',
  })
}