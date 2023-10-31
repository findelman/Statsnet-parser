const express = require("express");
const cors = require("cors");
let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}
const app = express();
const port = 3000;
app.use(cors());

async function extractData(page, textToFind) {
  const elements = await page.$$("tr.flex h3");
  for (let element of elements) {
    const text = await element.evaluate((el) => el.textContent.trim());
    if (text === textToFind) {
      const dateElement = await element.evaluateHandle((el) =>
        el.parentElement.nextElementSibling.querySelector("h4")
      );
      let date = await dateElement.evaluate((el) => el.textContent.trim());

      date = date.replace("stat.gov.kz", " stat.gov.kz");

      return date;
    }
  }
  return null;
}

app.get("/api/getInfo/:iin", async (req, res) => {
  try {
    const iin = req.params.iin;
    const searchURL = `https://statsnet.co/search/kz/${iin}`;

    let options = {};

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      options = {
        args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      };
    }

    const browser = await puppeteer.launch({
      ignoreDefaultArgs: ["--disable-extensions"],
    });
    const page = await browser.newPage();
    await page.goto(searchURL, { waitUntil: "domcontentloaded" });

    await page.waitForSelector("a.text-statsnet");
    const companyURL = await page.$eval(
      "a.text-statsnet",
      (element) => element.href
    );

    if (!companyURL) {
      await browser.close();
      return res.status(404).json({ error: "Компания не найдена" });
    }

    await page.goto(companyURL, { waitUntil: "domcontentloaded" });

    const fullName = await extractData(page, "Полное наименование");
    const dateRegistration = await extractData(page, "Дата регистрации");
    const lastReRegistrationDate = await extractData(
      page,
      "Дата последней перерегистрации"
    );

    console.log(lastReRegistrationDate, dateRegistration);
    await browser.close();

    res.json({
      fullName,
      dateRegistration:
        dateRegistration === "Неизвестнаkgd.gov.kz"
          ? lastReRegistrationDate
          : dateRegistration,
    });
  } catch (error) {
    console.error("Ошибка при парсинге данных:", error);
    res.status(500).json({ error: "Ошибка при получении данных" });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
