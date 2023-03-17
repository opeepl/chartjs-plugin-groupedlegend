import { DatasetGroup } from './dataset-group';

export type GroupedLegendPosition = 'top' | 'bottom' | 'left' | 'right';

export interface GroupedLegendOptions {
    display?: boolean;
    position?: GroupedLegendPosition;
    groups?: Array<DatasetGroup>;
}
