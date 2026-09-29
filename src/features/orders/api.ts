import api from "../../api/axios";
import type { OrderCreate, Order } from "./types";

export const CreateOrder = async (data: OrderCreate): Promise<Order> => {
    const response = await api.post<Order>("/trading/orders/", data);
    return response.data;
};

export const Orders = async (): Promise<Order[]> => {
    const response = await api.get<Order[]>("/trading/orders/");
    return response.data;
};

export const CancelOrder = async (orderId: number): Promise<Order> => {
    const response = await api.delete<Order>(`/trading/orders/${orderId}/`);
    return response.data;
};
