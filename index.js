const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000;

async function fetchData(url) {
  const response = await axios.get(url);
  return cheerio.load(response.data);
}

async function extractData($, selector, replaceText = "") {
    const header = $(selector);
    const text = header
      .parent()
      .next()
      .find("h4")
      .text()
      .trim();
  
    if (replaceText && text.includes(replaceText)) {
      return text.replace(replaceText, ` ${replaceText}`);
    }
  
    return text;
  }

app.get("/api/getInfo/:iin", async (req, res) => {
  try {
    const iin = req.params.iin;
    const searchURL = `https://statsnet.co/search/kz/${iin}`;
    const $ = await fetchData(searchURL);

    const companyLink = $("a.text-statsnet");
    const companyURL = companyLink.attr("href");

    const companyDataUrl = `https://statsnet.co${companyURL}`;
    const $companyData = await fetchData(companyDataUrl);
    const dateRegistration = await extractData(
        $companyData,
        'h3:contains("Дата регистрации")',
        "kgd.gov.kz"
      );
      
      const fullName = await extractData(
        $companyData,
        'h3:contains("Полное наименование")',
        "stat.gov.kz"
      );

    res.json({
    //   companyURL,
      fullName,
      dateRegistration,
    });
  } catch (error) {
    console.error("Ошибка при парсинге данных:", error);
    res.status(500).json({ error: "Ошибка при получении данных" });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
