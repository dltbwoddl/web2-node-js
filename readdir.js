//파일 리스트 불러오기
var testFolder = './data';
var fs = require('fs');

fs.readdir(testFolder,function(error, filelist){
    console.log(filelist);
})
// 결과 : [ 'css.txt', 'html.txt', 'javascript.txt', 'welcome.txt' ]