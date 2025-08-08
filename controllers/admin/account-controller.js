const Account = require("../../models/account-model")
const systemConfig = require('../../config/system')
const Role = require("../../models/role-model");
const md5 = require('md5');
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  }
  //select để lấy ra trường mình muốn chọn
  //còn thêm dấu trừ đằng trước để show hết ngoại trừ nó
  const records = await Account.find(find).select("-password -token")
  for (const record of records) {
    const role = await Role.findOne({ _id: record.role_id, deleted: false })

    record.role = role
  }
   
  res.render('admin/pages/account/index', {
    pageTitle: 'Trang tài khoản',
    records: records
  })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    
    const roles = await Role.find({
        deleted: false
    })
    
  res.render('admin/pages/account/create', {
    pageTitle: 'Tạo mới tài khoản',
    roles: roles
  })
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExists = await Account.findOne({
        email: req.body.email,
        deleted: false
    })
    if(emailExists){
        req.flash("error", `Email ${req.body.email} đã tồn tại`)
        const redirectUrl = req.get("Referer") || `${systemConfig.prefixAdmin}/accounts/create`;
        return res.redirect(redirectUrl); // ✅ return để tránh tiếp tục xử lý
    }else{
        req.body.password = md5(req.body.password)
        const records = new Account(req.body)
        await records.save()
        req.flash("success", "Tạo tài khoản thành công!");
        return res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
    
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const account = await Account.findById(req.params.id)
    const roles = await Role.find({
        deleted: false
    })
    
  res.render('admin/pages/account/edit', {
    pageTitle: 'Chỉnh sửa tài khoản',
    roles: roles,
    account: account
  })
}

// [PATCH] /admin/accounts/editPatch
module.exports.editPatch = async (req, res) => {
  const id = req.params.id
  const emailExists = await Account.findOne({
      //ne là not equal
      _id: {$ne: id},
      email: req.body.email,
      deleted: false
  })
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`
  }
  if(emailExists){
      req.flash("error", `Email ${req.body.email} đã tồn tại`)
      
  }else{
      
      if(req.body.password){
          req.body.password = md5(req.body.password)
      }else{
          delete req.body.password
      }
      await Account.updateOne({_id: id}, req.body)
      req.flash("success", "Cập nhật tài khoản thành công")
      //console.log(req.body)
      
      }
  const redirectUrl = req.get("Referer") 
  res.redirect(redirectUrl); 
    
}