import { Chart, Plugin, UpdateMode } from 'chart.js';
import {
  applyStyles,
  areAllDatasetsHidden,
  createElement,
  createGroupNameHtml,
  createLegendEntryHtml,
  determineLegendStyle,
  findGroupOffset,
} from './utils';

import { GroupedLegendOptions } from './grouped-legend-options';

/**
 * This chartjs plugin displays a legend labels grouped as provided in the options.
 */
export const GroupedLegend: Plugin<'line' | 'bar', GroupedLegendOptions> = {
  id: 'groupedlegend',
  /**
   * Restructures HTML from
   * <external-container>
   *     canvas
   * to
   * <external-container>
   *     div.legend-container
   *     div.canvas-container
   *         canvas
   * to allow for proper positioning and scaling of the legend and canvas with flexbox.
   */
  start: (chart: Chart): void => {
    const canvasHtml = chart.canvas;
    // There is always some container element (at worst, it is the <body>)
    const externalContainerHtml = canvasHtml.parentElement as HTMLElement;
    const legendContainerHtml = createElement('div', 'groupedlegend-legend-container');
    const canvasContainerHtml = createElement('div', 'groupedlegend-canvas-container');

    externalContainerHtml.appendChild(legendContainerHtml);
    externalContainerHtml.appendChild(canvasContainerHtml);
    canvasContainerHtml.appendChild(canvasHtml);
  },
  /**
   * Regenerates grouped legend HTML.
   */
  afterUpdate: (chart: Chart, _args: { mode: UpdateMode }, options: GroupedLegendOptions): void => {
    // The cast is safe, as there is always some container element (at worst, it is the <body>)
    const canvasContainerHtml = chart.canvas.parentElement as HTMLElement;
    // The cast is safe, as HTML was structured that way in start()
    const legendContainerHtml = canvasContainerHtml.previousSibling as HTMLElement;
    // Remove old legend items
    while (legendContainerHtml.firstChild) {
      legendContainerHtml.firstChild.remove();
    }

    // Determine legend style - 'rect' or 'circle'
    const legendPointStyle = determineLegendStyle(chart);

    // Generate new legend
    const isLegendEnabled = options.display ?? true;
    if (isLegendEnabled) {
      const groupContainers = new DocumentFragment();
      // Groups may be undefined, so we need to check for that
      const groups = options.groups ?? [];
      for (const group of groups) {
        // Create div container for each group
        const groupContainerHtml = createElement('div', 'groupedlegend-group-container');

        // Find offset of the current group in the array of groups.
        // In practice, it's the index of the first dataset in the group among all the datasets in the chart.
        const groupOffset = findGroupOffset(group, groups);
        const isGroupHidden = areAllDatasetsHidden(chart, group, groupOffset);

        // Create span element for the group name with proper click handling
        const groupNameHtml = createGroupNameHtml(chart, group, groupOffset, isGroupHidden);

        // Create list for all the group entries (color + name)
        const groupEntriesHtml = createElement('ul', 'groupedlegend-group-entries');

        for (let localIndex = 0; localIndex < group.datasets.length; localIndex++) {
          // Dataset global index is its index in the chart's datasets array
          const datasetGlobalIndex = groupOffset + localIndex;
          const dataset = group.datasets[localIndex];
          const entry = createLegendEntryHtml(chart, legendPointStyle, dataset, datasetGlobalIndex);
          groupEntriesHtml.appendChild(entry);
        }

        groupContainerHtml.appendChild(groupNameHtml);
        groupContainerHtml.appendChild(groupEntriesHtml);
        groupContainers.appendChild(groupContainerHtml);
      }
      legendContainerHtml.appendChild(groupContainers);

      // Apply all the styles
      applyStyles(chart, legendContainerHtml, canvasContainerHtml);
    }
  },
};

