export interface PortfolioHolding {
    symbol: string;
    company_name: string;
    quantity: number;
    average_buy_price: string | number;
    current_price: string | number;
    market_value: string | number;
    unrealized_profit_loss: string | number;
}
