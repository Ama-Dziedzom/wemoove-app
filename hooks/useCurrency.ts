import { useAppStore } from '@/store/app-store';
import currencies from '@/constants/currency';

export function useCurrency() {
  const { settings } = useAppStore();
  const currencyCode = settings.currency;
  const currencyInfo = currencies[currencyCode] || currencies.USD;
  
  const formatCurrency = (amount: number) => {
    return currencyInfo.format(amount);
  };
  
  return {
    currencyCode,
    currencySymbol: currencyInfo.symbol,
    currencyName: currencyInfo.name,
    formatCurrency
  };
}