const url = require('url')
const http = require('http')
const fs = require('fs')
const slugify = require('slugify')
const replaceTemplate = require('./modules/replaceTemplate')


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8') 
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8') 
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8') 

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8') 
  const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {
  const {query, pathname} = url.parse(req.url, true)

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text-html',
    })
    const cardHtml =dataObj.map(el => replaceTemplate(tempCard, el)).join('')

    const output = tempOverview.replace('{%PRODUCT_CARDS%', cardHtml)

    res.end(output)

    // Product page
  } else if( pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text-html',
    })
    const product = dataObj[query.id]
    const output = replaceTemplate(tempProduct, product)
    res.end(output)

    // API 
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json'})
      res.end(data)

      // Not Found
  } else {
    res.writeHead(404, {
      'Content-type': 'text-html',
      'my-own-header': 'Hello world'
    })
    res.end('<h1>Page not found</h1>')
  }
})

server.listen(8000, '127.0.0.1', () => {
  console.log('Server Listening on port 8000')
})