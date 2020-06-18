//ajax를 활용해 query string변화시 해당 txt 파일을 불러와 페이지를 생성하는 방법.
//abs.txt를 불러왔는데 해당 페이지의 html코드 전체가 나온다.?? 이유 알아보기.
var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title =queryData.id
    console.log(queryData.id);
    if(_url == '/'){
title = 'welcome';
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    var template =`
    <!doctype html>
<html>
<head>
<script src="https://code.jquery.com/jquery-1.12.4.min.js">
</script>  
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
<script>
var id ='${title}';
if(id==='HTML'){
  fetch('ads.txt').then(function(response){
    response.text().then(function(text){
      document.querySelector('article').innerHTML = text;
    })
  })
}
</script>
  <h1><a href="/">WEB</a></h1>
  <ul>
    <li><a href="/?id=HTML">HTML</a></li>
    <li><a href="/?id=CSS">CSS</a></li>
    <li><a href="/?id=JAVASCRIPT">JavaScript</a></li>
  </ul>
  <h2>${title}</h2>
  <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
  <img src="coding.jpg" width="100%">
  </p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
  </p>
  <article></article>
</body>
</html>
`
    console.log(__dirname + _url)
    response.end(template);
 
});
app.listen(3000);