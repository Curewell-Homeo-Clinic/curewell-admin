export function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getMoney(ammount: number): string {
  return `₹ ${new String(ammount).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function getExtension(fname: string) {
  return fname.slice((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);
}
