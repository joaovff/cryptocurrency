// api/coinApi.ts
import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

const coinApi = axios.create({
  baseURL: BASE_URL,
});




export const fetchCryptos = async () => {
  try {
    const response = await coinApi.get("/coins/markets", {
      params: {
        vs_currency: "eur",
        per_page: 50,
      },
    });
    return response.data;
  } catch (e) {
    console.error("Error fetching cryptos", e);
    throw e;
  }
};

export default coinApi;
