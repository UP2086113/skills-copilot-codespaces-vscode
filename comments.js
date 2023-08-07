// Create web server
// 1. Create web server
// 2. Read from file and send to client
// 3. Write to file and send to client
// 4. Read from file and send to client

// 1. Create web server
// 2. Read from file and send to client
// 3. Write to file and send to client
// 4. Read from file and send to client

var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var query = parsedUrl.query;
    var method = req.method;

    if (path === '/comments' && method === 'GET') {
        fs.readFile('./comments.json', function(err, data) {
            if (err) {
                res.statusCode = 500;
                res.end('Server Error');
            }
            res.statusCode = 200;
            res.end(data);
        });
    } else if (path === '/comments' && method === 'POST') {
        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            var comment = JSON.parse(body);
            fs.readFile('./comments.json', function(err, data) {
                if (err) {
                    res.statusCode = 500;
                    res.end('Server Error');
                }
                var comments = JSON.parse(data);
                comments.push(comment);
                fs.writeFile('./comments.json', JSON.stringify(comments), function(err) {
                    if (err) {
                        res.statusCode = 500;
                        res.end('Server Error');
                    }
                    res.statusCode = 201;
                    res.end(JSON.stringify(comment));
                });
            });
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(8080, function() {
    console.log('Listening on port 8080');
});