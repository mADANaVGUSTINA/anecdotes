const path = require("path");
const fs = require("fs");
const http = require("http");
const port = 3000;
let server = http.createServer(function(request, response){
    if(request.url === "/jokes" && request.method === 'GET'){
        getAllJokes(request, response);
    }

});
function getAllJokes(request, response){
    fs.readdirSync(__dirname, "data")
}

server.listen(port);