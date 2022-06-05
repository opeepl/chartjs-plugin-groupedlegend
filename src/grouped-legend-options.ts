import { ChartDataset } from 'chart.js';
import { DatasetGroup } from './dataset-group';

export interface GroupedLegendOptions {
    display?: boolean;
    groups?: Array<DatasetGroup<ChartDataset>>;
}
