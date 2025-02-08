// create a web server

// 1. Load the http module
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// 2. Create an http server to handle responses
http.createServer(function (request, response) {
  var path = url.parse(request.url).pathname;
  var query = url.parse(request.url).query;

  if (request.method === 'GET') {
    if (path === '/comments') {
      fs.readFile('comments.json', function (err, data) {
        if (err) {
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Internal Server Error');
        }
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(data);
      });
    } else {
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('Not Found');
    }
  } else if (request.method === 'POST') {
    if (path === '/comments') {
      var body = '';
      request.on('data', function (data) {
        body += data;
      });
      request.on('end', function () {
        var comment = qs.parse(body);
        fs.readFile('comments.json', function (err, data) {
          if (err) {
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
          }
          var comments = JSON.parse(data);
          comments.push(comment);
          fs.writeFile('comments.json', JSON.stringify(comments, null, 2), function (err) {
            if (err) {
              response.writeHead(500, { 'Content-Type': 'text/plain' });
              response.end('Internal Server Error');
            }
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(comment));
          });
        });
      });
    } else {
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('Not Found');
    }
  } else {
    response.writeHead(405, { 'Content-Type': 'text/plain' });
    response.end('Method Not Allowed');
  }
}).listen(3000, '