module.exports = (query)=>{
    let objectSearch ={
        keyword: ""
    }
  
    if(query.keyword){
        objectSearch.keyword = query.keyword;
        //ng dùng tìm từ khóa mang máng và "i" là ko phân biệt hoa vs thường
        //học thêm regex
        const regex = new RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regex;
    }
    return objectSearch;
}