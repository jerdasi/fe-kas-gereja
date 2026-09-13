export const formatCurrency = (value: number, currency = "IDR") => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
};
