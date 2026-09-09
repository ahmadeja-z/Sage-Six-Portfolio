export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(n: number): string {
  return n.toString().padStart(2, "0");
}