const puppeteer = require('puppeteer');
var browser;
(async () => {
    browser = await puppeteer.launch({headless: true,args: [
                // Required for Docker version of Puppeteer
                '--no-sandbox',
                '--disable-setuid-sandbox',
                // This will write shared memory files into /tmp instead of /dev/shm,
                // because Docker’s default for /dev/shm is 64MB
                '--disable-dev-shm-usage'
            ]}
);
})()

var cors = require('cors')

const allowedOrigins = ['http://127.0.0.1:5500'];
const express = require('express')
const port = 3000
const app = express()

app.use(cors({
    origin: function(origin, callback){
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  
  }))
app.get('/search', async (req, res) => {
    query = req.query.q
    var data = await search(query);
    return res.send(data);

})


async function search(q) {
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.goto('https://google.com/search?q=' + q);
    const datas = await page.evaluate(() => {
        var datas = [];
        // document.querySelectorAll("#search > div > div > div").map(el => console.log(el.querySelector('div > div > div:first-child > div > a') ? el.querySelector('div > div > div:first-child > div > a').getAttribute('href') : ''))
        document.querySelectorAll("#search > div > div > div").forEach(el => {
            var data = {};

            data['url'] = {
                'href' : el.querySelector('div > div > div:first-child > div > a') ? el.querySelector('div > div > div:first-child > div > a').getAttribute('href') : '',
                'text' : el.querySelector('div > div > div:first-child > div > a > h3') ? el.querySelector('div > div > div:first-child > div > a > h3').textContent : ''
            }

            data['description'] = el.querySelector('div > div > div').outerHTML
            datas.push(data)
        })

        return datas;

    });

    page.close()

    return datas;
}
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })