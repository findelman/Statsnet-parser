// // const express = require("express");
// // const axios = require("axios");
// // const cheerio = require("cheerio");
// // const cors = require("cors");
// // const puppeteer = require("puppeteer"); // Добавляем Puppeteer

// // const app = express();
// // const port = 3000;
// // app.use(cors());

// // async function fetchData(url) {
// //   const response = await axios.get(url);
// //   return cheerio.load(response.data);
// // }

// // async function extractData($, selector, replaceText = "") {
// //   const header = $(selector);
// //   const text = header.parent().next().find("h4").text().trim();

// //   if (replaceText && text.includes(replaceText)) {
// //     return text.replace(replaceText, ` ${replaceText}`);
// //   }

// //   return text;
// // }

// // app.get("/api/getInfo/:iin", async (req, res) => {
// //   try {
// //     const iin = req.params.iin;
// //     const searchURL = `https://statsnet.co/search/kz/${iin}`;

// //     const browser = await puppeteer.launch({ headless: "new" });
// //     const page = await browser.newPage();
// //     await page.goto(searchURL, { waitUntil: "domcontentloaded" });

// //     await page.waitForSelector("a.text-statsnet");
// //     const companyURL = await page.$eval("a.text-statsnet", (element) => element.href);

// //     console.log(companyURL)
// //     await browser.close();

// //     if (!companyURL) {
// //       return res.status(404).json({ error: "Компания не найдена" });
// //     }

// //     const companyDataUrl = `https://statsnet.co${companyURL}`;
// //     const $companyData = await fetchData(companyDataUrl);

// //     const dateRegistration = await extractData(
// //       $companyData,
// //       'h3:contains("Дата регистрации")',
// //       "kgd.gov.kz"
// //     );

// //     const lastReRegistrationDate = await extractData(
// //       $companyData,
// //       'h3:contains("Дата последней перерегистрации")',
// //       "kgd.gov.kz"
// //     );

// //     const fullName = await extractData(
// //       $companyData,
// //       'h3:contains("Полное наименование")',
// //       "stat.gov.kz"
// //     );

// //     res.json({
// //       fullName,
// //       dateRegistration: dateRegistration === "Неизвестна kgd.gov.kz" ? lastReRegistrationDate : dateRegistration,
// //     });
// //   } catch (error) {
// //     console.error("Ошибка при парсинге данных:", error);
// //     res.status(500).json({ error: "Ошибка при получении данных" });
// //   }
// // });

// // app.listen(port, () => {
// //   console.log(`Сервер запущен на порту ${port}`);
// // });
// @@ -2,6 +2,7 @@ const express = require("express");
// const axios = require("axios");
// const cheerio = require("cheerio");
// const cors = require("cors");
// const puppeteer = require("puppeteer"); // Добавляем Puppeteer

// const app = express();
// const port = 3000;
// @ -27,13 +28,24 @@ app.get("/api/getInfo/:iin", async (req, res) => {
//   try {
//     const iin = req.params.iin;
//     const searchURL = `https://statsnet.co/search/kz/${iin}`;
//     const $ = await fetchData(searchURL);

//     const companyLink = $("a.text-statsnet");
//     const companyURL = companyLink.attr("href");
//     const browser = await puppeteer.launch({ headless: "new" });
//     const page = await browser.newPage();
//     await page.goto(searchURL, { waitUntil: "domcontentloaded" });

//     await page.waitForSelector("a.text-statsnet");
//     const companyURL = await page.$eval("a.text-statsnet", (element) => element.href);

//     console.log(companyURL)
//     await browser.close();

//     if (!companyURL) {
//       return res.status(404).json({ error: "Компания не найдена" });
//     }

//     const companyDataUrl = `https://statsnet.co${companyURL}`;
//     const $companyData = await fetchData(companyDataUrl);

//     const dateRegistration = await extractData(
//       $companyData,
//       'h3:contains("Дата регистрации")',
// @ -52,9 +64,7 @@ app.get("/api/getInfo/:iin", async (req, res) => {
//       "stat.gov.kz"
//     );

//     console.log()
//     res.json({
//       //   companyURL,
//       fullName,
//       dateRegistration: dateRegistration === "Неизвестна kgd.gov.kz" ? lastReRegistrationDate : dateRegistration,
//     });
// @ -67,6 +77,3 @@ app.get("/api/getInfo/:iin", async (req, res) => {
// app.listen(port, () => {
//   console.log(`Сервер запущен на порту ${port}`);
// });


// //  