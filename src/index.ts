import { ChartType } from 'chart.js';
import { GroupedLegendOptions } from './grouped-legend-options';

// This module augmentation allows typehinting of options in Vue files
declare module 'chart.js' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    interface PluginOptionsByType<TType extends ChartType> {
        groupedlegend?: GroupedLegendOptions;
    }
}

export * from './dataset-group';
export * from './plugin';
export * from './grouped-legend-options';
