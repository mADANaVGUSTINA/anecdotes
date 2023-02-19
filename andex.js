const path = require("path");
const fs = require("fs");
const http = require("http");
const port = 3000;
let server = http.createServer(function(request, response){
    if(request.url === "/api/jokes" && request.method === 'GET'){
        let jokis = getAllJokes(request, response);
        response.writeHead(200, {"Content-type":"text/json"})
        response.end(JSON.stringify(jokis));
    }
    else if(request.url === "/api/jokes" && request.method === 'POST'){
        let data = '';
        request.on('data', function(chunk){
            data += chunk;
        })
        request.on('end', function(){
            addJoke(data);
        })
        response.end
    }
});
function getAllJokes(request, response){
    let pth = path.join(__dirname, "data")
    let ss = fs.readdirSync(pth);
    let jarr = [];
    for(let i = 0; i < ss.length; i++){
        let read = JSON.parse(fs.readFileSync(path.join(pth, i +".json"), "utf-8"));
        jarr.push(read);
    };
    return jarr
}
function addJoke(joke){
    let jokedata = JSON.parse(joke);
    jokedata.likes = 0;
    jokedata.dislikes = 0;
    let pthD = path.join(__dirname, "data");
    let pthf = path.join(pthD, `${fs.readdirSync(pthD).length}.json`)
    fs.writeFileSync(pthf , JSON.stringify(jokedata));
}

server.listen(port);