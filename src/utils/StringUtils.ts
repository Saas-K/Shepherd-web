export function currency(number: string) {
  return parseInt(number).toLocaleString();
}

export function numberPadLeft(number: number) : string {
  return number < 10 ? `0${number}` : number.toString();
}