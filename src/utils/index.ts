export function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getMoney(ammount: number): string {
  return `₹ ${new String(ammount).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
