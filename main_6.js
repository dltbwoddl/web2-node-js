//package manager
//npm
//pm2 -- 만든 프로그램 꺼지면 다시켜주기도하고 파일이 수정되면 자동으로 프로그램 껐다 켜주기도 한다.
//pm2 start main_5.js --watch 파일 수정했을 때 끄고 켜지 않아도 된다.
//pm2 log 에러 바로 보여줌.

//html form, 사용자가 콘텐츠 생성할 수 있도록 하는 도구.
//여러줄 입력은 textarea태그로, 입력받은 정보 전송은 type='submit'
//어디로 보낼지는 form으로 감싸고 action=path를 입력하면 된다. 값마다 name주기.
//get방식으로 전송하기 때문에 쿼리스트링이 생성된다.(서버에서 데이터를 가져올 때 사용)
//하지만 이방식은 주소에 정보가 있으면 아무나 정보를 수정하고 삭제할 수있게 된다.
//수정할 때는 post방식으로 해야 한다. 아주 큰 데이터도 전송 가능.
//placeholder = input 박스에 어떤 내용을 넣어야 할지 사용자에게 알려준다.

//post방식으로 전송된 데이터 받기.
//데이터 받아서 디렉토리 안에 저장하기.(nodejs file write)
//사용자 다른페이지로 보내기, 리다이렉션

var http = require('http');//To use the HTTP server and client one must require('http').
var fs = require('fs');//The fs module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions.
var url = require('url');//The url module provides utilities for URL resolution and parsing.
var qs = require('querystring');

function templatehtml(title,list,body,control){
  console.log(12);
    return(
    `
    <!doctype html>
<html>
<head>
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="/">WEB</a></h1>
  ${list}
  ${control}
  ${body}
</body>
</html>
`)
};

function listtemplate(filelist){
  console.log(10);
    var list = '<ul>';
for (var i = 0; i < filelist.length; i++) {
list = list + (`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`);
console.log(list);
list=list+'</br>';
}return list;}

function getpage(queryDataid,response){
  if (queryDataid == undefined) {
    var title = 'welcome';
    var describesion = 'welcome';
    fs.readdir('./data', function (error, filelist) {
      var list = listtemplate(filelist);
      var template = templatehtml(title,list,`<h2>${title}</h2><p>${describesion}</p>`,`<a href='/create'>creat</a>`)
      response.writeHead(200);
      response.end(template);
      ;

    });
  }
  else {
    fs.readFile('data/' + `${queryDataid}` , 'utf8', function (err, describesion) {
      var title = queryDataid
      fs.readdir('./data', function (error, filelist) {
      var list =listtemplate(filelist);
      var template = templatehtml(title,list,`<h2>${title}</h2><p>${describesion}</p>`,`<a href='/create'>creat</a> <a href = '/update?id=${title}'>update</a>`)
      response.writeHead(200);
      response.end(template);
    });
});
}
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname == '/') {
    getpage(queryData.id,response);
  }
  else if(pathname === '/create'){
    var title = 'create';
    fs.readdir('./data', function (error, filelist) {
      var list = listtemplate(filelist);
      var template = templatehtml(title,list,
        `
        <form action="http://localhost:4000/process_create"
        method ="post"
        <p><input type='text' name='title' placeholder='title'>
        </p>
        <p><textarea name="description" placeholder="description">
        </textarea>
        </p>
        <p>
        <input type='submit'>
        </p></form>`,'')
      response.writeHead(200);
      response.end(template);
      ;

    });
  }
  else if (pathname === '/process_create') {
      //post방식의 데이터 받기.
      var body = '';
      request.on('data', function (data) {
          body = body + data;
      });
      request.on('end', function () {
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf-8'
              , function (err) {

                  response.writeHead(302, {location:`/?id=${title}`});
                  response.end();
              })
      });

  }
  else {
    response.writeHead(404);
    response.end('not page found');
  }
});
app.listen(4000);