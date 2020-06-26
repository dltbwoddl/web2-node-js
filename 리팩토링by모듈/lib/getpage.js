var fs = require('fs');//The fs module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions.
var template=require('./template.js');s
module.exports = {
    page:function(queryDataid,response){
        if (queryDataid == undefined) {
    
            fs.readdir('./data', function (error, filelist) {
              var title = 'welcome';
              var describesion = 'welcome';  
              console.log(10);
              var list = template.list(filelist);
              var html = template.html(title,list,
                `<h2>${title}</h2><p>${describesion}</p>`,
                `<a href='/create'>creat</a> 
                <a href = '/update?id=${title}'>update</a>`);
              response.writeHead(200);
              response.end(html);
              ;
        
            });
          }
          else {
            fs.readFile('data/' + `${queryDataid}` , 'utf8', function (err, describesion) {
              var title = queryDataid
              fs.readdir('./data', function (error, filelist) {
              var list =template.list(filelist);
              var html = template.html(title,list,
                `<h2>${title}</h2><p>${describesion}</p>`,
              `<a href='/create'>creat</a> 
              <a href = '/update?id=${title}'>update</a>
              <form action="delete_process" method="post"> 
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
              </form>`)
              response.writeHead(200);
              response.end(html);
            });
        });
        }
    }
}
