module.exports.createPost = (req,res, next)=>{
    if(!req.body.title){
    req.flash("error", "Vui lòng nhập tiêu đề")
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
    return
  }
  next()
}