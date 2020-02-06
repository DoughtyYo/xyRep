// http.js
const http = require('http');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql');

const genResponse = message => JSON.stringify({
  success: true,
  data: message
},null,4);

console.log(genResponse(process.env));

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST || 'localhost' || 'mysql',
  port: 3306||process.env.DB_PORT ,
  user: process.env.DB_USER,
  password : 'mysqlPassword',
  database : 'basedb'
});

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  const reqUrl = url.parse(req.url);

  var select='';
  switch(reqUrl.pathname){
    case '/api/get/users':
      {
        select = `Select * from userTest`;
        break;
      }
      case '/api/get/welcome':
      {
        console.log('welcome docker log!!');
        res.end("welcome docker!!");
        break;
      }
      default:
      {
        var pathStr='/api/insert';
        if(reqUrl.pathname.substring(0,pathStr.length)==pathStr)
        {
          select = `INSERT INTO userTest
          ( name) VALUES 
          ( '`+reqUrl.pathname.substring(pathStr.length+1,reqUrl.pathname.length)+`');`
          console.log(genResponse(reqUrl.pathname));
        }else{
          res.writeHeader(404);
          res.end('NotFund');
        }
        break;
      }
        
  }
  connection.query(select, function (error, results) {
    if (error) {
        console.log(`error:`+error)
        res.end(genResponse(error));
      } else {
        console.log(`results:`+results)
        res.end(genResponse(results));
      }
    });
}).listen(8000, ()=> {
  console.log('listen on 8000!');
})