//data mysql로 옮기기 + 아이디 계속 생산해 페이지 업그레이드 하기.+res.writehead와 end의 관계
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var datei = new Date();
var date=datei.getMonth()+1+"m"+datei.getDate()+"d";
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
      </form>
    <form action="http://localhost:3000/tip${date}">
    <button type="submit"><sup>tipdata</sup></button>
    </form>
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
template2 = function (tipdata) {
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
<h1>tip table</h1>
    <table>
    <tr>
        <th>Date</th>
        <th>Tip</th>
    <tr>
    ${tipdata}
    </table>
    <form method="post" action="http://localhost:3000/">
    <button type="submit"><sup>BACKtocalculator</sup></button>
    </form>
    <form action="http://localhost:3000/delete">
    <button type="submit"><sup>DELETEDATA</sup></button>
    </form>
    <form action="http://localhost:3000/before">
    <button type="submit"><sup>before</sup></button>
    </form>
    <form action="http://localhost:3000/today">
    <button type="submit"><sup>today</sup></button>
    </form>
</body>
</html>`
        )
}
var i=1;
console.log("serverstart");
var app = http.createServer(function (request, response) {
    var datei = new Date();
    var date=datei.getMonth()+1+"m"+datei.getDate()+"d";
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
        var body = '';
        request.on('data', function (data) {
            body = body + data;
            console.log("data:",body);
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var tipv = post.tip;
            fs.appendFile(`data/tip${date}`, `<tr><td>${date}</td><td>${tipv}$</td></tr>\n`, 'utf-8'
                , function (err) {
                    response.writeHead(302, { location: `./tip${date}` });
                    response.end();
                    console.log("dataappendcomplete and goto db");
                });
        });

    }
    else if (pathname === `/tip${date}`) {
        fs.readFile(`./data/tip${date}`, (err, tipdata) => {
            template_2=template2(tipdata);
            response.writeHead(200);
            response.end(template_2);
            console.log("this is page tips")
    })
    }
    else if (pathname==="/delete"){
        fs.unlink(`./data/tip${date}`, (err) => {
            if (err) throw err;
            console.log(`./data/tip${date}was deleted`);
            response.writeHead(302, { location: `/tip${date}` })
            response.end()
          });
    }
    else if (pathname==="/before"){
        //이부분 정확수정하기.다양한 경우의 수 고려해서
        var datei = new Date();
        var date=datei.getMonth()+1-i+"m"+datei.getDate()+"d";
        fs.readFile(`./data/tip${date}`, (err, tipdata) => {
            template_2=template2(tipdata);
            response.writeHead(200);
            response.end(template_2);
            console.log("this is page tips")
        })
    }
    else if(pathname==="/today"){
        var datei = new Date();
        var date=datei.getMonth()+1+"m"+datei.getDate()+"d";
        response.writeHead(302, { location: `./tip${date}` });
        response.end();
    //     fs.readFile(`./data/tip${date}`, (err, tipdata) => {
    //         template_2=template2(tipdata);
    //         response.writeHead(302, { location: `./tip${date}` });
    //         response.end();
    //         console.log("this is page tips")
    // });
    }
    console.log("server end point");
});
app.listen(3000);