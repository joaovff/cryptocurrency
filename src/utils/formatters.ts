export const formatPrice = (price: number): string => {
  // Format price numbers to PT/PT EUR and check if the number is less then 0.1, if yes, the full number will be returned
  if (price < 1) {
    return price.toFixed(8).replace(".", ",") + " €";
  }
  return price.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
};
