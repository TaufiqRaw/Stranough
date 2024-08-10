export function priceFormat(num : number, digits : number = 2) : string {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: " Ribu" },
    { value: 1e6, symbol: " Juta" },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find(item => num >= item.value);
  return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
} 
