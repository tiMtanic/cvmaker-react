const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  month: "short",
  year: "numeric",
});

export function formatDate(date: string | null | undefined) {
  if (!date) return "";

  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return dateFormatter.format(parsedDate);
}

export function formatYearsExperience(years: number | null | undefined) {
  if (years === null || years === undefined) return "";

  return `${years} ${years === 1 ? "yr" : "yrs"}`;
}
