const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const random = require('random-num')
const initialIteration = Number(process.argv[2]) || 0;

async function save(url, value) {
    if (value) {
        console.log(`Found: ${url} | Value: ${value}`);
        fs.appendFileSync(
            path.join(__dirname, 'url-validated.txt'),
            url + '\n',
            { encoding: 'utf8' })
    }
}

async function run (url) {
    let browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    let page = await browser.newPage()
    
    await page.goto(url)
    await page.waitForSelector('body > div:nth-child(11) > div > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > span:nth-child(1)')

    let data = await page.$eval('body > div:nth-child(11) > div > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > span:nth-child(1)',
        childs => childs.textContent)

    await save(url, data);

    await browser.close()

    return data;
}

// uji coba
// run('https://pages.lazada.co.id/wow/i/id/search/search-voucher-detail?wh_weex=true&voucherChannel=msgcenter&voucherId=204736676400001')
//     .then(() => console.log('done'))

// pakai random
async function recursiveRun(iter) {
    let i = iter

    let number = 70000000 + i
    let voucher_id = `20${number}00001`

    console.log(`check url: https://pages.lazada.co.id/wow/i/id/search/search-voucher-detail?wh_weex=true&voucherChannel=msgcenter&voucherId=${voucher_id}`)

    await run(`https://pages.lazada.co.id/wow/i/id/search/search-voucher-detail?wh_weex=true&voucherChannel=msgcenter&voucherId=${voucher_id}`)
        .then(() => {
            console.log(`check done ${i}`)
            recursiveRun(i + 1)
        })
        .catch(err => {
            console.log(err)
            console.log(`timeout internet connection ${i + 1} retrying...`)
            recursiveRun(i)
        })
}

// mulai dari 0 iterasi atau sesuai inputan
recursiveRun(initialIteration);
