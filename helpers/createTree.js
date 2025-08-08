let count = 0
const createTree = (arr, parentId ="")=>{
    const tree = []
      arr.forEach((item) => {
        if(item.parent_id == parentId){
            count++
            const newItem = item
            newItem.index = count
            const children = createTree(arr,item.id)
                if(children.length > 0){
                    newItem.children = children
                }
            tree.push(newItem)
        }
      });
    return tree
}
module.exports.create=(arr, parentId ="")=>{
    const tree = createTree(arr, parentId ="")
    return tree
}

// const createTree = (arr, parentId = null, level = 0) => {
//   const tree = []

//   arr.forEach((item) => {
//     const itemParentId = item.parent_id ? item.parent_id.toString() : ''
//     const currentParentId = parentId ? parentId.toString() : ''

//     if (itemParentId === currentParentId) {
//       const children = createTree(arr, item._id, level + 1)

//       tree.push({
//         _id: item._id,
//         title: item.title,
//         parent_id: item.parent_id,
//         description: item.description,
//         thumbnail: item.thumbnail,
//         position: item.position,
//         status: item.status,
//         deleted: item.deleted,
//         level, // THÊM LEVEL nếu bạn muốn sử dụng
//         children,
//       })
//     }
//   })

//   return tree
// }

// module.exports.create = createTree
