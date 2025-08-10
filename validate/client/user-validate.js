module.exports.validateRegister = (req,res, next)=>{
    if(!req.body.fullName){
    req.flash("error", "Vui lòng nhập họ tên")
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
    return
  }
  

  if(!req.body.email){
    req.flash("error", "Vui lòng nhập email")
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
    return
  }
  

  if(!req.body.password){
    req.flash("error", "Vui lòng nhập mật khẩu")
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
    return
  }
  next()
}

module.exports.validateLogin = (req,res, next)=>{

  if(!req.body.email){
    req.flash("error", "Vui lòng nhập email")
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
    return
  }
  

  if(!req.body.password){
    req.flash("error", "Vui lòng nhập mật khẩu")
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
    return
  }
  next()
}

module.exports.validateForgotPassWord = (req,res, next)=>{

  if(!req.body.email){
    req.flash("error", "Vui lòng nhập email")
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
    return
  }
  next()
}

module.exports.validateResetPassword = (req,res, next)=>{

  if(!req.body.password){
    req.flash("error", "Mật khẩu không được để trống!")
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
    return
  }
  if(!req.body.confirmPassword){
    req.flash("error", "Vui lòng xác nhận lại mật khẩu!")
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
    return
  }
  if(req.body.password != req.body.confirmPassword){
    req.flash("error", "Mật khẩu không trùng khớp!")
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
    return
  }
  next()
}