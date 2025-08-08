const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

//Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET, // Click 'View API Keys' above to copy your API secret
})

module.exports.upload = async (req, res, next) =>{
  if (req.file) {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result)
          else reject(error)
        })
        streamifier.createReadStream(req.file.buffer).pipe(stream)
      })
    }

    try {
      const result = await streamUpload(req)
      req.body[req.file.fieldname] = result.secure_url
      next() // Chỉ gọi sau khi upload thành công
    } catch (error) {
      console.error("Upload ảnh thất bại:", error)
      return res.status(500).send("Upload ảnh thất bại")
    }
    } else {
        next() // Nếu không có file thì vẫn tiếp tục
    }
}