#!/usr/bin/env node
import http from'http';import fs from'fs';import path from'path';import{fileURLToPath}from'url';
const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename),root=path.resolve(__dirname,'..');
const a=process.argv.slice(2),p=+((a.find(x=>/^(--port=|-p=)\d+$/i.test(x))||'').split('=')[1]||process.env.PORT||8080);
const ex=()=>{try{return fs.readdirSync(path.join(root,'examples')).filter(f=>/\.html?$/i.test(f)).sort()}catch{return[]}};
const m=(f)=>({'.html':'text/html; charset=utf-8','.htm':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.txt':'text/plain; charset=utf-8'}[path.extname(f).toLowerCase()]||'application/octet-stream');
const safe=(u)=>{let s=decodeURIComponent((u||'/').split('?')[0]).replace(/\\/g,'/');if(!s.startsWith('/'))s='/'+s;s=path.posix.normalize(s);if(s.includes('..'))return null;return s==='/'?'/index.html':s};
const send=(res,code,body,ct='text/plain; charset=utf-8')=>{res.writeHead(code,{'content-type':ct,'cache-control':'no-cache'});res.end(body)};
const serve=(req,res)=>{const u=safe(req.url);if(!u)return send(res,400,'Bad path');const fp=path.join(root,u.slice(1));fs.stat(fp,(e,st)=>{if(e)return send(res,404,'Not found');if(st.isDirectory())return send(res,403,'Directory listing disabled');fs.readFile(fp,(e,b)=>e?send(res,500,'Read error'):send(res,200,b,m(fp)))})};
const s=http.createServer(serve);let port=p,logged=0;
const log=()=>{if(logged)return;logged=1;const pt=s.address().port,base=`http://localhost:${pt}`;console.log(`Dev server: ${base}/`);const xs=ex();if(xs.length){console.log('Examples:');xs.forEach(f=>console.log(`- ${base}/examples/${f}`))}else console.log('Examples: (none found)')};
const tryListen=()=>s.listen(port,'0.0.0.0');
s.on('listening',log);
s.on('error',e=>{if(e&&e.code==='EADDRINUSE'){port++;return tryListen()}throw e});
tryListen();
