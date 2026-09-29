import api from "../../api/axios";
import type { PortfolioHolding } from "./types";

export const Portfolio = async (): Promise<PortfolioHolding[]> => {
    const response = await api.get<PortfolioHolding[]>("/trading/portfolio/");
    return response.data;
};
