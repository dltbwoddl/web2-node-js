var fs = require('fs');//The fs module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions.
var template=require('./template.js');
var path =require('path')
var sanitizeHtml = require('sanitize-html');

module.exports = {
    page:function(queryDataid,response){
        if (queryDataid == undefined) {
    
            fs.readdir('./data', function (error, filelist) {
              var title = 'welcome';
              var describesion = 'welcome';  
              var list = template.list(filelist);
              var html = template.html(title,list,
                `<h2>${title}</h2><p>${describesion}</p>`,
                `<a href='/create'>creat</a>`);
              response.writeHead(200);
              response.end(html);
              ;
        
            });
          }
          else {
              var filteredId = path.parse(queryDataid).base;
            fs.readFile('data/' + `${filteredId}` , 'utf8', function (err, describesion) {
              var title = queryDataid
              var sanitizedtitle=sanitizeHtml(title);
              var sanitizeddescribesion = sanitizeHtml(describesion,{allowedTags:['h1']});
              fs.readdir('./data', function (error, filelist) {
              var list =template.list(filelist);
              var html = template.html(sanitizedtitle,list,
                `<h2>${sanitizedtitle}</h2><p>${sanitizeddescribesion}</p>`,
              `<a href='/create'>creat</a> 
              <a href = '/update?id=${sanitizedtitle}'>update</a>
              <form action="delete_process" method="post"> 
              <input type="hidden" name="id" value="${sanitizedtitle}">
              <input type="submit" value="delete">
              </form>`)
              response.writeHead(200);
              response.end(html);
            });
        });
        }
    }
}
