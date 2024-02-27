import { extractData } from "../helpers/extractData";
import { fetchData } from "../helpers/fetchData";
import express = require("express");

const router = express.Router();

router.get("/getInfo/:iin", async (req, res) => {
    try {
      const iin = req.params.iin;
      const result = await getInfo(iin);
      res.json(result);
    } catch (error) {
      console.error("Ошибка при парсинге данных:", error);
      res.status(500).json({ error: "Ошибка при обработке запроса" });
    }
  });
  
  async function getInfo(iin: string) {
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
  
    const resultDate =
      dateRegistration === "Неизвестна kgd.gov.kz"
        ? lastReRegistrationDate === "Неизвестна"
          ? null
          : lastReRegistrationDate
        : dateRegistration;
  
    return {
      fullName,
      dateRegistration: resultDate,
    };
  }
  
  export default router;
  