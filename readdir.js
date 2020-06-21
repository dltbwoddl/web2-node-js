//파일 리스트 불러오기
var testFolder = './data';//./은 현재 디렉토리에서 라는 
var fs = require('fs');

fs.readdir(testFolder,function(error, filelist){
    console.log(filelist);
})
// 결과 : [ 'css.txt', 'html.txt', 'javascript.txt', 'welcome.txt' ]
