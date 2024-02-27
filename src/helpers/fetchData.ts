import axios from "axios";
import cheerio = require("cheerio");

const axiosConfig = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  },
};

export const fetchData = async (url) => {
  const response = await axios.get(url, axiosConfig);
  return cheerio.load(response.data);
};
