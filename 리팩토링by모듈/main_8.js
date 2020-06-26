//리팩토링,객체 사용해서 정리하기. template부분.

//모듈은 객체보다 더 큰 정리정돈 도구이다.
//파일로 쪼개서 웹으로 독립시킬 수 있다.
//module.exports = m;이 모듈 밖에서 m이라는 객체 사용할 수 있도록 한다.
//require로 불러올 수 있다. var part=require('./mpart.js');
var http = require('http');//To use the HTTP server and client one must require('http').
var fs = require('fs');//The fs module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions.
var url = require('url');//The url module provides utilities for URL resolution and parsing.
var qs = require('querystring');
var template=require('./lib/template.js');
var get=require('./lib/getpage.js');

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname == '/') {
    get.page(queryData.id,response);
  }
  else if(pathname === '/create'){
    var title = 'create';
    fs.readdir('./data', function (error, filelist) {
      var list = template.list(filelist);
      var html = template.html(title,list,
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
      response.end(html);
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
        var title = queryData.id
        fs.readdir('./data', function (error, filelist) {
        var list =template.list(filelist);
        var html = template.html(title,list,`
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
        response.end(html);})
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
          if (err) throw err;
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