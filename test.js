(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.goto('https://google.com/search?q=ngide.net');
    await page.screenshot({path: 'example.png'});
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

    console.log(datas)
  
    await page.close();
  })();