import { useEffect, useState } from "react";
import { fetchCryptos } from "../api/coinApi";
import { Crypto } from "../utils/types";

export const useFetchCryptos = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchCryptos();
        setCryptos(data);
      } catch (err) {
        setError("Failed to fetch cryptos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { cryptos, loading, error };
};
