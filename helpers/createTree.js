// let count = 0
// const createTree = (arr, parentId ="")=>{
//     const tree = []
//       arr.forEach((item) => {
//         if(item.parent_id == parentId){
//             count++
//             const newItem = item
//             newItem.index = count
//             const children = createTree(arr,item.id)
//                 if(children.length > 0){
//                     newItem.children = children
//                 }
//             tree.push(newItem)
//         }
//       });
//     return tree
// }
// module.exports.create=(arr, parentId ="")=>{
//     const tree = createTree(arr, parentId ="")
//     return tree
// }

let count = 0;

const createTree = (arr, parentId = "") => {
  const tree = [];

  arr.forEach((item) => {
    const pid = item.parent_id ? item.parent_id.toString() : "";
    const currentParent = parentId ? parentId.toString() : "";

    if (pid === currentParent) {
      count++;
      const newItem = { ...item._doc, id: item._id.toString(), index: count }; // tránh thay đổi item gốc
      const children = createTree(arr, item._id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });

  return tree;
};

module.exports.create = (arr, parentId = "") => {
  count = 0; // reset khi tạo cây mới
  return createTree(arr, parentId);
};

