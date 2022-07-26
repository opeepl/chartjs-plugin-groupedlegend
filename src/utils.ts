import { Chart, ChartDataset, ChartType, PointStyle } from 'chart.js';
import { DatasetGroup } from './dataset-group';
import { Styles } from './grouped-legend-styles';

/**
 * Utility function to set CSS styles on an HTML element.
 */
function setStyles(style: CSSStyleDeclaration, legendContainerStyles: Partial<CSSStyleDeclaration>): void {
  for (const key in legendContainerStyles) {
    if (Object.prototype.hasOwnProperty.call(legendContainerStyles, key)) {
      style[key] = legendContainerStyles[key] ?? '';
    }
  }
}

/**
 * Sets the visibility of the given group.
 */
function setGroupVisibility(chart: Chart, groupOffset: number, groupSize: number, hidden: boolean): void {
  for (let i = 0; i < groupSize; i++) {
    const targetIndex = groupOffset + i;
    chart.setDatasetVisibility(targetIndex, hidden);
  }
  chart.update();
}

/**
 * Creates span element with given name and optional strike through if the whole group is hidden.
 */
function createGroupNameHtml(chart: Chart, group: DatasetGroup, groupOffset: number, isGroupHidden: boolean): HTMLSpanElement {
  const groupNameHtml = document.createElement('span');
  setStyles(groupNameHtml.style, Styles.legendGroupName);
  if (isGroupHidden) {
    setStyles(groupNameHtml.style, Styles.hidden);
  }
  groupNameHtml.innerText = group.name;
  groupNameHtml.onclick = () => {
    setGroupVisibility(chart, groupOffset, group.datasets.length, isGroupHidden);
  };
  return groupNameHtml;
}

/**
 * Based on chart.legend.options, determines the style of the groupedlegend entries.
 * Currently, only 'rect' and 'circle' are supported.
 */
function determineLegendStyle(chart: Chart): PointStyle {
  let legendPointStyle: PointStyle = 'rect';
  if (chart.legend?.options.labels.usePointStyle) {
    legendPointStyle = 'circle';
    const chartPointStyle = chart.legend.options.labels.pointStyle;
    if (chartPointStyle === undefined || chartPointStyle === 'rect' || chartPointStyle === 'circle') {
      legendPointStyle = chartPointStyle ?? 'circle';
    } else {
      console.warn(`chart.legend.options.labels.pointStyle is set to ${chart.legend.options.labels.pointStyle}. Only 'rect' and 'circle' are supported by groupedlegend. Falling back to 'circle'.`);
    }
  }
  return legendPointStyle;
}

/**
 * Creates SVG rectangle legend marker element with the given color.
 */
function createSvgMarker(color: string, style: PointStyle): SVGSVGElement {
  const svgNs = 'http://www.w3.org/2000/svg';
  const svgContainer = document.createElementNS(svgNs, 'svg');
  const markerStyles = style === 'rect' ? Styles.legendEntryMarkerRect : Styles.legendEntryMarkerCircle;
  setStyles(svgContainer.style, Styles.legendEntryMarkerBase);
  setStyles(svgContainer.style, markerStyles);
  const rect = document.createElementNS(svgNs, 'rect');
  rect.setAttribute('height', '100%');
  rect.setAttribute('width', '100%');
  rect.setAttribute('fill', color);
  svgContainer.appendChild(rect);
  return svgContainer;
}

/**
 * Toggles the visibility of the given dataset.
 */
function toggleDataset(chart: Chart, datasetIndex: number): void {
  chart.setDatasetVisibility(datasetIndex, !chart.isDatasetVisible(datasetIndex));
  chart.update();
}

/**
 * Creates HTML element for legend entry.
 * It is structured as follows:
 * ```html
 * <li>
 *    <span> <!-- dataset color -->
 *    <span> <!-- dataset name -->
 * </li>
 * ```
 * If the dataset is hidden, the name is striked through.
 */
function createLegendEntryHtml(chart: Chart, markerStyle: PointStyle, dataset: ChartDataset<ChartType, unknown>, datasetGlobalIndex: number): HTMLLIElement {
  const entryHtml = document.createElement('li');
  setStyles(entryHtml.style, Styles.legendEntry);
  if (!chart.isDatasetVisible(datasetGlobalIndex)) {
    setStyles(entryHtml.style, Styles.hidden);
  }

  const markerColor = (dataset.backgroundColor ?? '#FFFFFF').toString();
  const entryMarkerHtml = createSvgMarker(markerColor, markerStyle);

  const entryNameHtml = document.createElement('span');
  setStyles(entryNameHtml.style, Styles.legendEntryName);
  entryNameHtml.innerText = dataset.label ?? '';

  entryHtml.appendChild(entryMarkerHtml);
  entryHtml.appendChild(entryNameHtml);

  // When the dataset name or label is clicked, toggle the dataset visibility
  entryHtml.onclick = () => {
    toggleDataset(chart, datasetGlobalIndex);
  };
  return entryHtml;
}

/**
 * Finds an offset of the given group in the array of grouped chart datasets.
 * The offset is the index of the first dataset in the group.
 * @example
 * // Simplified DatasetGroup to illustrate the example
 * const groups = [{datasets: [5, 1, 8, 6]}, {datasets: [7, 0]}];
 * const group1 = groups[0];
 * const group2 = groups[1];
 * const group1Offset = findGroupOffset(group1, groups); // Offset of group1 is 0
 * const group2Offset = findGroupOffset(group2, groups); // Offset of group2 is 4
 */
function findGroupOffset(targetGroup: DatasetGroup, groups: Array<DatasetGroup>): number {
  let offset = 0;
  for (const group of groups) {
    if (group === targetGroup) {
      return offset;
    }
    offset += group.datasets.length;
  }
  throw new Error('Group not found');
}

/**
 * Checks if all the datasets in the group are hidden.
 */
function areAllDatasetsHidden(chart: Chart, group: DatasetGroup, groupOffset: number): boolean {
  for (let i = 0; i < group.datasets.length; i++) {
    const targetIndex = groupOffset + i;
    if (chart.isDatasetVisible(targetIndex)) {
      return false;
    }
  }
  return true;
}

export {
  setStyles,
  createGroupNameHtml,
  createLegendEntryHtml,
  findGroupOffset,
  areAllDatasetsHidden,
  determineLegendStyle,
};
