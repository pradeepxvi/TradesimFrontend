import { useQuery } from "@tanstack/react-query";
import { NepseCandles } from "../../api/market";
import { PriceChart } from "./StockDetailPanel";

const NepseChart = () => {
    const { data, isLoading } = useQuery({
        queryFn: NepseCandles,
        queryKey: ["nepse-candles"],
    });

    if (!data) return null;

    return (
        <PriceChart
            candles={data}
            isLoading={isLoading}
            hasError={Boolean(isLoading)}
            label="Nepse Chart"
        />
    );
};

export default NepseChart;
