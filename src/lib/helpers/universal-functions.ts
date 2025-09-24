
export const truncateWords = (str: string, maxLength: number): string =>{
  if (!str) return "";
  if (str.length <= maxLength) return str;

  const truncated = str.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}
