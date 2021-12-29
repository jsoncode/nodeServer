import fs from 'fs'
import https from 'https'
import path from 'path'

let options = {
    key: fs.readFileSync('../crt/private.key'),
    cert: fs.readFileSync('../crt/mydomain.crt')
};

/*
fetch('/test',{
    method:'POST',
    headers:{
        'content-type':'application/json',
    },
    body:JSON.stringify({a:1})
}).then(res=>res.json()).then(res=>{
    console.log(res)
})
*/
// 创建app
let app = https.createServer(options, function (req, res) {
    let url = req.url;
    let method = req.method;
    let pathname = url.split('?')[0]
    let query = url.split('?')?.[1]?.split('#')?.[0]
    let p = path.join(/^\/gitpage|work-task\//.test(url) ? 'C:/chris-workspace/' : path.resolve('./static/'), pathname)
    if (/[\\\/]$/.test(p)) {
        p = path.join(p, 'index.html')
    }
    if (method === 'POST') {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            data = JSON.parse(data.toString())
            res.writeHead(200, {"content-Type": "application/json;charset=utf-8"});
            res.end(JSON.stringify({
                code: 1,
                message: '',
                data: data
            }));
        })
    } else {
        if (fs.existsSync(p)) {
            let info = fs.statSync(p)
            if (info.size > 10 * 1024 * 1024) {
                res.writeHead(200, {"content-Type": "text/html;charset=utf-8"});
                res.end('文件过大');
            } else {
                let file = fs.readFileSync(p, {encoding: 'utf-8'})
                // file = `<div class="markdown-text">${file}</div>`
                // let tpl = fs.readFileSync('./tpl.html', {encoding: 'utf-8'})
                // file = tpl.replace(/\s*\{\s*content\s*\}\s*/ig, file).replace(/\s*\{\s*title\s*\}\s*/, pathname)
                res.writeHead(200, {"content-Type": "text/html;charset=utf-8"});
                res.write(file);
                res.end();
            }
        } else {
            res.writeHead(404, {"content-Type": "text/html;charset=utf-8"});
            res.end('没有找到任何资源');
        }
    }

})
app.listen(443, "0.0.0.0");

console.log('https://localhost')