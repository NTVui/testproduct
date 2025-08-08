module.exports.createPost = (req,res, next)=>{
    if(!req.body.fullname){
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

module.exports.editPatch = (req,res, next)=>{
    if(!req.body.fullname){
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
  next()
}