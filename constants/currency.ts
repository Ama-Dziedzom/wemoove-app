export interface CurrencyInfo {
    code: string;
    symbol: string;
    name: string;
    format: (amount: number) => string;
  }
  
  const currencies: Record<string, CurrencyInfo> = {
    GHS: {
      code: 'GHS',
      symbol: '₵',
      name: 'Ghana Cedi',
      format: (amount: number) => `₵${amount.toFixed(2)}`
    },
    USD: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
      format: (amount: number) => `$${amount.toFixed(2)}`
    },
    EUR: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      format: (amount: number) => `€${amount.toFixed(2)}`
    },
    GBP: {
      code: 'GBP',
      symbol: '£',
      name: 'British Pound',
      format: (amount: number) => `£${amount.toFixed(2)}`
    }
  };
  
  export default currencies;