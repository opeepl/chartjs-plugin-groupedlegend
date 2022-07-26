import { Chart, Plugin, UpdateMode } from 'chart.js';
import { setStyles, findGroupOffset, areAllDatasetsHidden, createGroupNameHtml, createLegendEntryHtml, determineLegendStyle } from './utils';
import { GroupedLegendOptions } from './grouped-legend-options';
import { Styles } from './grouped-legend-styles';

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
  start: (chart: Chart) => {
    const canvasHtml = chart.canvas;
    // The cast is safe, as there is always some container element (at worst, it is the <body>)
    const externalContainerHtml = canvasHtml.parentElement as HTMLElement;

    const legendContainerHtml = document.createElement('div');
    setStyles(legendContainerHtml.style, Styles.legendContainer);

    const canvasContainerHtml = document.createElement('div');
    setStyles(canvasContainerHtml.style, Styles.canvasContainer);

    externalContainerHtml.appendChild(legendContainerHtml);
    externalContainerHtml.appendChild(canvasContainerHtml);
    canvasContainerHtml.appendChild(canvasHtml);
  },
  /**
     * Regenerates grouped legend HTML.
     */
  afterUpdate: function(chart: Chart, _args: { mode: UpdateMode }, options: GroupedLegendOptions): void {
    // Grab default values before every drawing, as they might have changed in the meantime
    Styles.setDefaultsFromChart(chart);
    // The cast is safe, as there is always some container element (at worst, it is the <body>)
    const containerElement = chart.canvas.parentElement as HTMLElement;
    // The cast is safe, as HTML was structured that way in start()
    const legendContainerHtml = containerElement.previousSibling as HTMLElement;
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
        const groupContainerHtml = document.createElement('div');
        setStyles(groupContainerHtml.style, Styles.legendGroupContainer);

        // Find offset of the current group in the array of groups.
        // In practice, it's the index of the first dataset in the group among all the datasets in the chart.
        const groupOffset = findGroupOffset(group, groups);
        const isGroupHidden = areAllDatasetsHidden(chart, group, groupOffset);

        // Create span element for the group name with proper click handling
        const groupNameHtml = createGroupNameHtml(chart, group, groupOffset, isGroupHidden);

        // Create list for all the group entries (color + name)
        const groupEntriesHtml = document.createElement('ul');
        setStyles(groupEntriesHtml.style, Styles.legendGroup);

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
    }
  },
};
