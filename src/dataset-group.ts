import { ChartDataset } from 'chart.js';

export interface DatasetGroup<T extends ChartDataset> {
    name: string;
    datasets: Array<T>;
}
