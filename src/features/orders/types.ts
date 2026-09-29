export interface OrderCreate {
    symbol: string;
    side: "BUY" | "SELL";
    quantity: number;
}

export interface Order {
    id: number;
    symbol: string;
    side: "BUY" | "SELL";
    quantity: number;
    price: string;
    total_amount: string;
    status: "EXECUTED" | "REJECTED";
    created_at: string;
}
