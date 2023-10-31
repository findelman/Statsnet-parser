const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(cors());

const axiosConfig = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  },
};

async function fetchData(url) {
  const response = await axios.get(url, axiosConfig);
  return cheerio.load(response.data);
}

async function extractData($, selector, replaceText = "") {
  const header = $(selector);
  const text = header.parent().next().find("h4").text().trim();

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

    const lastReRegistrationDate = await extractData(
      $companyData,
      'h3:contains("Дата последней перерегистрации")',
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
      dateRegistration:
        dateRegistration === "Неизвестна kgd.gov.kz"
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

