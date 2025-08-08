

//Permission
// const tablePermission = document.querySelector("[table-permission]")
// if(tablePermission){
//     const buttonSubmit = document.querySelector("[button-submit]")
//     buttonSubmit.addEventListener("click",()=>{
//         let permissions = []
//         const rows = tablePermission.querySelectorAll("[data-name]")
//         rows.forEach((row)=>{
//             const name = row.getAttribute("data-name")
//             const inputs = row.querySelectorAll("input")
//             if(name == "id"){
//                 inputs.forEach(input=>{
//                     const id = input.value
//                     permissions.push({
//                         id: id,
//                         permissions:[]
//                 })
//                 })
                
//             }else{
//                 inputs.forEach((input, index)=>{
//                     const checked = input.checked
//                     if(checked){
//                         permissions[index].permissions.push(name)
//                     }
                    
//                 })
//             }
//         })
//         console.log(permissions)
//         if(permissions.length > 0){
//             const formChangePermission = document.querySelector("#form-change-permissions")
//             const inputPermission = formChangePermission.querySelector("input[name='permissions']")
//             inputPermission.value = JSON.stringify(permissions)
//             formChangePermission.submit()
            

//         }
//     })
// }



const tablePermission = document.querySelector("[table-permission]")

if (tablePermission) {
  const buttonSubmit = document.querySelector("[button-submit]")

  buttonSubmit.addEventListener("click", () => {
    const permissions = []

    //  Lấy hàng chứa các role ID (dòng có data-name="id")
    const rowId = tablePermission.querySelector('tr[data-name="id"]')
    const idInputs = rowId?.querySelectorAll("input")

    if (!idInputs || idInputs.length === 0) return
    //  Khởi tạo mỗi role một object có id & rỗng permissions
    idInputs.forEach(input => {
      const id = input.value
      permissions.push({ id, permissions: [] })
    })

    //  Xử lý tất cả dòng quyền (trừ dòng id)
    const rows = tablePermission.querySelectorAll("tr[data-name]")
    rows.forEach(row => {
      const permissionName = row.getAttribute("data-name")
      if (permissionName === "id") return

      const checkboxes = row.querySelectorAll("input[type='checkbox']")
      checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
          permissions[index]?.permissions.push(permissionName)
        }
      })
    })

    console.log(permissions)

    //  Gửi dữ liệu nếu có
    if (permissions.length > 0) {
      const form = document.querySelector("#form-change-permissions")
      const input = form.querySelector("input[name='permissions']")
      input.value = JSON.stringify(permissions)
      form.submit()
    }
  })
}

