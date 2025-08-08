const Product = require('../../models/product-model')
const productHelper = require('../../helpers/product')
const User = require('../../models/user-model')
const ForgotPassword = require('../../models/forgot-password-model')
const generateHelper = require("../../helpers/generate")
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
      deleted: false
  })
  if(existEmail){
      req.flash("error", "Email đã tồn tại")
      const redirectUrl = req.get("Referer")
      return res.redirect(redirectUrl);
  }
  req.body.password = md5(req.body.password)
  const user = new User(req.body)
  await user.save()
  //console.log(user)
  res.cookie("tokenUser", user.tokenUser)
  res.redirect("/")
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
    deleted: false
  })
  if(!user){
      req.flash("error", "Email không tồn tại")
      const redirectUrl = req.get("Referer")
      return res.redirect(redirectUrl);
  }
  if(md5(password) != user.password){
      req.flash("error", "Sai mật khẩu")
      const redirectUrl = req.get("Referer")
      return res.redirect(redirectUrl);
  }
  if(user.status == "inactive"){
      req.flash("error", "Tài khoản đang bị khóa")
      const redirectUrl = req.get("Referer")
      return res.redirect(redirectUrl);
  }
  res.cookie("tokenUser", user.tokenUser)
  
  res.redirect("/")
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser")
  res.redirect("/")
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
    deleted: false
  })
  if(!user){
      req.flash("error", "Email không tồn tại")
      const redirectUrl = req.get("Referer")
      return res.redirect(redirectUrl);
  }

  //1. Tạo mã OTP và lưu thông tin yêu cầu (OTP, email) vào collection forgot-password
  const otp = generateHelper.generateRandomNumber(8)
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now()
  }
  const forgotPassword = new ForgotPassword(objectForgotPassword)
  await forgotPassword.save()
  //console.log(objectForgotPassword)

  //2. Gửi mã OTP qua email của user
  res.redirect(`/user/password/otp?email=${email}`)
}

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  res.render('client/pages/user/otp-password', {
    pageTitle: 'Nhập mã OTP',
    email: req.query.email
  })
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email
  const otp = req.body.otp
  console.log({
    email: email,
    otp: otp
  })
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  })
  //console.log(result)
  if(!result){
    req.flash("error", "OTP không hợp lệ")
    const redirectUrl = req.get("Referer")
    return res.redirect(redirectUrl);
  }
  const iser = await User.findOne({
    email: email
  })
  //Trả cho client token của họ
  res.cookie("tokenUser", user.tokenUser)
  res.redirect("/user/password/reset")
}