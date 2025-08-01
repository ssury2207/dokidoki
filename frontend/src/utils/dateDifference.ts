export default function getDateDiffInDays(
  dateStr1: string,
  dateStr2: string
): number {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);

  // Strip time part to compare by date only
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
