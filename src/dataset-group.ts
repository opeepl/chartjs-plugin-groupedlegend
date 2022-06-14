import { ChartDataset, ChartType } from 'chart.js';

export interface DatasetGroup<T extends ChartDataset<ChartType, unknown> = ChartDataset<ChartType, unknown>> {
    name: string;
    datasets: Array<T>;
}
