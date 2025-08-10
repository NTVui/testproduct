const SettingGeneral = require("../../models/setting-general")
const systemConfig = require('../../config/system')


// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({})
    console.log(settingGeneral)
    res.render("admin/pages/setting/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral
    });
}

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
    //console.log(req.body)
    const settingGeneral = await SettingGeneral.findOne({})
    if(settingGeneral){
        await SettingGeneral.updateOne({
            _id: settingGeneral.id
        }, req.body)
    }else{
        const record = new SettingGeneral(req.body)
        await record.save()
    }
    
    req.flash("success", "Cập nhật thành công!")
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
}
