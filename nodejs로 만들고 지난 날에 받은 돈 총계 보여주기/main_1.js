//tips페이지가 제대로 나오지 않는 이유는 fs.readfile은 비동기적 처리를 한다.
//비동기적 처리는 해당 구간에 들어가면 그것을 다처리하고 다음으로 넘어가는 것이 아니라 
//처리하는 동안 뒤에 것을 먼저 시행하다가 실행이 완료되면 callback함수가 실행되는 것을 말한다.
//해당 코드는 template2함수안에 fs.read함수를 실행하고 callback으로 tips페이지 html을 반환한다.
//이렇게 처리하면 html이 반환되기 전에 서버 응답이 끝난다. 때문에 main_2에서는 fs.read 함수의 callback안에 응답을 넣어
//data를 가져오는 것을 기다린 후 서버가 응답하도록 했다.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path')
template1 = function (cssfile, jsfile) {
    return (
        `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${cssfile}</style>
  <title>Document</title>
</head>
<body>
  <div id="container">
      <h1>Tip Calculator</h1>
      <div id="calculator">
    
    
        <form>
          <p>How much was your bill?
            <p>
              $ <input id="billamt" type="text" placeholder="Bill Amount">
    
              <p>How was your service?
                <p>
                  <select id="serviceQual">
                    <!--disabled selected value="0" 안누르면 0이 선택됨. defalut값-->
                <option disabled selected value="0">-- Choose an Option --</option>
                <option value="0.3">30&#37; &#45; Outstanding</option>
                <option value="0.2">20&#37; &#45; Good</option>
                <option value="0.15">15&#37; &#45; It was OK</option>
                <option value="0.1">10&#37; &#45; Bad</option>
                <option value="0.05">5&#37; &#45; Terrible</option>
            </select>
    
        </form>
        <p>How many people are sharing the bill?</p>
        <input id="peopleamt" type="text" placeholder="Number of People"> people
        <button type="button" id="calculate">Calculate!</button>
      
      </div>
      <!--calculator end-->      
      <form method="post" id="dtip" action="http://localhost:3000/data">
      <div id="totalTip">
        <sup>$</sup><input id="tip" type='text' name='tip' value=0 readonly>
        <small id="each">each</small>
      </div>
      <!--totalTip end-->
    </div>
    </form>
    <!--container end-->
    <script>${jsfile}</script>
</body>
</html>
`)

}
template2 = function () {
    fs.readFile("./data/tip", (err, tipdata) => {
        console.log(tipdata);
        return (
            `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <p>${tipdata}</p>
</body>
</html>`
        )
    })
}
console.log("serverstart");
var app = http.createServer(function (request, response) {
    var _url = request.url;
    var pathname = url.parse(_url, true).pathname;
    console.log("pathname:",pathname);
    if (pathname === "/") {
        fs.readFile('./jscss/style.css', (err, data_1) => {
            fs.readFile('./jscss/tipcalculator.js', (err, data_2) => {
                template_1 = template1(data_1, data_2);
                response.writeHead(200);
                response.end(template_1);
                console.log("template1 upload");
            })
        })
    }
    else if (pathname === '/data') {
        //post방식의 데이터 받기.
        var body = '';
        request.on('data', function (data) {
            body = body + data;
            console.log("data:",body);
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var title = post.tip;
            var date = new Date();
            fs.appendFile(`data/tip`, `\n${date}:${title}`, 'utf-8'
                , function (err) {
                    response.writeHead(302, { location: "./tips" });
                    response.end();
                    console.log("dataappendcomplete and goto ./tips");
                });
        });

    }
    else if (pathname === "/tips") {
        fs.readFile("./data/tip", (err, tipdata) => {})
        template_2=template2();
        response.writeHead(200);
        response.end(template_2);
        console.log("this is page tips")
    }
    console.log("server end point");
});
app.listen(3000);
