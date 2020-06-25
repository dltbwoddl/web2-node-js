//글수정-수정할 정보 전송
//글 삭제 기능 구현하기.
//특강 js에서 객체와 배열은 모두 정보를 정리정돈하는 도구이다.
//객체는 순서 없이, 배열은 순서에 따라서
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
      var template = templatehtml(title,list,`<h2>${title}</h2><p>${describesion}</p>`,`<a href='/create'>creat</a> <a href = '/update?id=${title}'>update</a>`)
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
      var template = templatehtml(title,list,`<h2>${title}</h2><p>${describesion}</p>`,
      `<a href='/create'>creat</a> <a href = '/update?id=${title}'>update</a>
      <form action="delete_process" method="post"> 
      <input type="hidden" name="id" value="${title}">
      <input type="submit" value="delete">
      </form>`)
      response.writeHead(200);
      response.end(template);
    });
});
}
}

var app = http.createServer(function (request, response) {
    console.log(pathname);
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
        method ="post">
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

  }else if(pathname==='/update'){
    fs.readFile('data/' + `${queryData.id}` , 'utf8', function (err, describesion) {
        console.log(1);
        console.log(pathname);
        var title = queryData.id
        fs.readdir('./data', function (error, filelist) {
        var list =listtemplate(filelist);
        var template = templatehtml(title,list,`
        <form action="http://localhost:4000/update_process"
        method ="post">
        <input type = 'hidden' name='id' value=${title}>
        <p><input type='text' name='title' placeholder='title' value='${title}'>
        </p>
        <p><textarea name="description" placeholder="description">
        </textarea>
        </p>
        <p>
        <input type='submit'>
        </p></form>`,`<a href='/create'>creat</a> <a href = '/update?id=${title}'>update</a>`)
        response.writeHead(200);
        response.end(template);})
    })
  }
  else if(pathname==='/update_process'){
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        var id=post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`,`data/${title}`, (err) => {
          console.log('Rename complete!');
          fs.writeFile(`data/${title}`, description, 'utf-8'
            , function (err) {
                response.writeHead(302, {location:`/?id=${title}`});
                response.end();
            })
        });
        
    });

  }
  else if (pathname=="/delete_process"){
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        var id=post.id;
        fs.unlink(`data/${post.id}`, (err) => {
          console.log(`data/${post.id}`)
          if (err) throw err;
          console.log(`${post.id} was deleted`);
          response.writeHead(302, {location:`/`});
                response.end();
        });     
    });
  }
  else {
    response.writeHead(404);
    response.end('not page found');
  }
});
app.listen(4000);