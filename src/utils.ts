import { Chart, ChartDataset } from 'chart.js';
import { DatasetGroup } from './dataset-group';
import { styles } from './grouped-legend-styles';

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
function createGroupNameHtml(chart: Chart, group: DatasetGroup<ChartDataset>, groupOffset: number, isGroupHidden: boolean): HTMLSpanElement {
  const groupNameHtml = document.createElement('span');
  setStyles(groupNameHtml.style, styles.legendGroupName);
  if (isGroupHidden) {
    setStyles(groupNameHtml.style, styles.hidden);
  }
  groupNameHtml.innerText = group.name;
  groupNameHtml.onclick = () => {
    setGroupVisibility(chart, groupOffset, group.datasets.length, isGroupHidden);
  };
  return groupNameHtml;
}

/**
 * Creates SVG rectangle legend marker element with the given color.
 */
function createSvgMarker(color: string): SVGSVGElement {
  const svgNs = 'http://www.w3.org/2000/svg';
  const svgContainer = document.createElementNS(svgNs, 'svg');
  setStyles(svgContainer.style, styles.legendEntryMarker);
  const rect = document.createElementNS(svgNs, 'rect');
  setStyles(rect.style, styles.legendEntryMarkerRect);
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
function createLegendEntryHtml(chart: Chart, dataset: ChartDataset, datasetGlobalIndex: number): HTMLLIElement {
  const entryHtml = document.createElement('li');
  setStyles(entryHtml.style, styles.legendEntry);
  if (!chart.isDatasetVisible(datasetGlobalIndex)) {
    setStyles(entryHtml.style, styles.hidden);
  }

  const entryMarkerHtml = createSvgMarker((dataset.backgroundColor ?? '#FFFFFF').toString());

  const entryNameHtml = document.createElement('span');
  setStyles(entryNameHtml.style, styles.legendEntryName);
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
 * // Simplified DatasetGroup<ChartDataset> to illustrate the example
 * const groups = [{datasets: [5, 1, 8, 6]}, {datasets: [7, 0]}];
 * const group1 = groups[0];
 * const group2 = groups[1];
 * const group1Offset = findGroupOffset(group1, groups); // Offset of group1 is 0
 * const group2Offset = findGroupOffset(group2, groups); // Offset of group2 is 4
 */
function findGroupOffset(targetGroup: DatasetGroup<ChartDataset>, groups: Array<DatasetGroup<ChartDataset>>): number {
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
function areAllDatasetsHidden(chart: Chart, group: DatasetGroup<ChartDataset>, groupOffset: number): boolean {
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
  areAllDatasetsHidden
};
