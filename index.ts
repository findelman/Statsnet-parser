import express = require("express");
import cors = require("cors");
import { fetchData } from "./helpers/fetchData";
import { extractData } from "./helpers/extractData";

const app = express();
const port = 3000;
app.use(cors());

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
      fullName,
      dateRegistration:
        dateRegistration === "Неизвестна kgd.gov.kz"
          ? lastReRegistrationDate
          : dateRegistration,
    });
  } catch (error) {
    console.error("Ошибка при парсинге данных:", error);
    res.status(200).json({ fullName: null, dateRegistration: null });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});


// test 