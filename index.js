const fs = require('fs'); // built file strctutre
const http = require('http'); // built http server
const url = require('url'); // for rounting
const replaceTemplate = require('./modules/replaceTemplate');

///////////////////////////////////////////////////
/// FILES

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);


// const textOut = `Power Texkeoff: ${textIn}. created on ${Date.now()}.` ;
// fs.writeFileSync('./txt/output.txt', textOut);
// const textIn2 = fs.readFileSync('./txt/output.txt', 'utf-8');

// console.log(textIn2);


// Async
// fs.readFile('./txt/start.txt','utf-8', (err, data1) => {
//     console.log(data1);
//     fs.readFile(`./txt/${data1}.txt`,'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`,'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}` ,'utf-8', err=> {
//                 console.log('Your file has been written ');
//             })
//         });
//     });
// });
// console.log('will read file');


///////////////////////////////////////////////////////////////////////
// SERVER


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);

console.log(dataObj);
const server = http.createServer((req, res) => {
    console.log(req.url)
    const { query, pathname } = url.parse(req.url, true)

    // OVERVIEW PAGE
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
    // PRODUCT PAGE
    } else if(pathname === '/product') {
        const product = dataObj[query.id];
        res.writeHead(200, {'Content-type': 'text/html'});
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    // API
    } else if (pathname ==='/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
        //res.end('API');
    } else {
        res.writeHead(404, {
            'Content-type' : 'text/html',
            'my-own-header': 'helloworld'
        });
        res.end('<h1>page not found!</h1>');
    }
    console.log(req.url);
    // console.log(req);
    // res.end('Hello from the server!');
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});