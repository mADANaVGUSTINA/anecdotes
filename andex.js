const path = require("path");
const fs = require("fs");
const http = require("http");
const url = require("url");
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
        response.end()
    }
    else if(request.url.startsWith('/api/likes')){
        let reqUrl = request.url
        if(LikeOrDislike(reqUrl, true)){
            response.writeHead(200);
            response.end();
        }else{
            response.writeHead(400);
            response.end();
        }
    }
    else if(request.url.startsWith('/api/dislikes')){
        let reqUrl = request.url
        if(LikeOrDislike(reqUrl, false)){
            response.writeHead(200);
            response.end();
        }else{
            response.writeHead(400);
            response.end();
        }
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
function LikeOrDislike(reqUrl, chek){
    const params = url.parse(reqUrl, true).query;
        if(isNaN(params.id)){
            return false
        }
        let pthD = path.join(__dirname, "data");
        let jknumb = fs.readdirSync(pthD).length;
        if(params.id < 0 || params.id >= jknumb){
            return false
        }
    let pthF = path.join(pthD, `${params.id}.json`);
    let joker = JSON.parse(fs.readFileSync(pthF, "utf-8"));
    if(chek == true){
        joker.likes++;
    }
    else{
        joker.dislikes++;
    }
    fs.writeFileSync(pthF, JSON.stringify(joker));
    return true
}

server.listen(port);