
export const truncateWords = (str: string, maxLength: number): string =>{
  if (!str) return "";
  if (str.length <= maxLength) return str;

  const truncated = str.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}



// export const formatPrice =(price: string | number): string =>{
//      if(price && Number(price)){
//        return "GH₵ " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//      }
//      return ""
// }


export const formatPrice = (value: string | number) => {
  if (!value) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
