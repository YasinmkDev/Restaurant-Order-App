/**
 * Currency formatting utility for Swift Courier.
 * Defaults to Pakistani Rupee (Rs. / PKR) as per project requirements.
 */
export function formatCurrency(amount: number, symbol: string = 'Rs.'): string {
  const formatted = Math.round(amount).toLocaleString('en-US');
  return `${symbol} ${formatted}`;
}
