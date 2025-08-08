const buttonChangeStatus = document.querySelectorAll('[button-change-status]')
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector('#form-change-status')
  const path = formChangeStatus.getAttribute('data-path')
  //console.log(path);
  buttonChangeStatus.forEach((button) => {
    button.addEventListener('click', () => {
      const statusCurrent = button.getAttribute('data-status')
      const id = button.getAttribute('data-id')
      let statusChange = statusCurrent == 'active' ? 'inactive' : 'active'

      const action = path + `/${statusChange}/${id}?_method=PATCH`
      formChangeStatus.action = action
      formChangeStatus.submit()
    })
  })
}

//Delete Item
const buttonDelete = document.querySelectorAll('[button-delete]')
if (buttonDelete.length > 0) {
  const formDeleteItem = document.querySelector('#form-delete-item')
  const path = formDeleteItem.getAttribute('data-path')
  buttonDelete.forEach((button) => {
    button.addEventListener('click', () => {
      const Confirm = confirm('Có chắc muốn xóa không?')

      if (Confirm) {
        const id = button.getAttribute('data-id')
        const action = `${path}/${id}?_method=DELETE`

        formDeleteItem.action = action
        formDeleteItem.submit()
      }
    })
  })
}
//  Remove Image Preview & Handle File Input
document.querySelectorAll('.upload-wrapper').forEach((wrapper) => {
  const input = wrapper.querySelector('[upload-image-input]')
  const removeImageFlag = wrapper.querySelector('.remove-image-flag')

  //  Khởi tạo sẵn wrapper preview nếu có sẵn ảnh ban đầu
  let imageWrapper = wrapper.querySelector('.image-preview-wrapper')
  let image = wrapper.querySelector('.image-preview')
  let removeBtn = wrapper.querySelector('.remove-image')

  //  Hàm xoá ảnh preview (dùng lại nhiều lần)
  const removePreview = () => {
    if (imageWrapper) imageWrapper.style.display = 'none'
    if (input) input.value = ''
    if (removeImageFlag) removeImageFlag.value = 'true'
  }

  //  Event nút "X" xoá ảnh hiện tại
  if (removeBtn) {
    removeBtn.addEventListener('click', removePreview)
  }

  //  Khi chọn ảnh mới → hiện preview
  input.addEventListener('change', (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = function (e) {
      const previewURL = e.target.result

      //  Nếu chưa có wrapper → tạo mới
      if (!imageWrapper) {
        imageWrapper = document.createElement('div')
        imageWrapper.className = 'image-preview-wrapper'
        imageWrapper.style.cssText = 'position: relative; display: inline-block;'

        image = document.createElement('img')
        image.className = 'image-preview'
        image.width = 200
        image.alt = 'preview'
        imageWrapper.appendChild(image)

        removeBtn = document.createElement('button')
        removeBtn.className = 'btn btn-danger btn-sm remove-image'
        removeBtn.type = 'button'
        removeBtn.style.cssText = 'position: absolute; top: 0; right: 0;'
        removeBtn.textContent = 'X'
        removeBtn.addEventListener('click', removePreview)
        imageWrapper.appendChild(removeBtn)

        wrapper.appendChild(imageWrapper)
      }

      //  Cập nhật ảnh & hiện lại wrapper nếu từng ẩn
      image.src = previewURL
      imageWrapper.style.display = 'inline-block'

      //  Reset cờ xoá ảnh
      if (removeImageFlag) removeImageFlag.value = 'false'
    }

    reader.readAsDataURL(file)
  })
})

