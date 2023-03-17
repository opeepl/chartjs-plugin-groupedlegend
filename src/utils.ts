import { Chart, ChartDataset, ChartType, PointStyle } from 'chart.js';
import { DatasetGroup } from './dataset-group';
import { Styles } from './grouped-legend-styles';

/**
 * Set CSS styles on an HTML element.
 */
function setStyles(style: CSSStyleDeclaration, legendContainerStyles: Partial<CSSStyleDeclaration>): void {
  for (const key in legendContainerStyles) {
    if (Object.prototype.hasOwnProperty.call(legendContainerStyles, key)) {
      style[key] = legendContainerStyles[key] ?? '';
    }
  }
}

/**
 * Apply the given styles to the provided list of HTML elements.
 * @example
 * setStylesAll(document.querySelectorAll('.groupedlegend-group-container'), Styles.legendGroupContainer);
 */
function setStylesAll(elements: NodeListOf<HTMLElement>, styles: Partial<CSSStyleDeclaration>): void {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    setStyles(element.style, styles);
  }
}

/**
 * Create element with the given tag name and class names.
 */
function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, ...classNames: Array<string>): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  element.classList.add(...classNames);
  return element;
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
  const groupNameHtml = createElement('span', 'groupedlegend-group-name');
  if (isGroupHidden) {
    groupNameHtml.classList.add('hidden');
  }
  groupNameHtml.innerText = group.name;
  groupNameHtml.onclick = (): void => {
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
      console.warn(
        `chart.legend.options.labels.pointStyle is set to ${chart.legend.options.labels.pointStyle}. Only 'rect' and 'circle' are supported by groupedlegend. Falling back to 'circle'.`,
      );
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
  svgContainer.classList.add('groupedlegend-marker');
  svgContainer.classList.add(`${style}`);
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
function createLegendEntryHtml(
  chart: Chart,
  markerStyle: PointStyle,
  dataset: ChartDataset<ChartType, unknown>,
  datasetGlobalIndex: number,
): HTMLLIElement {
  const entryHtml = createElement('li', 'groupedlegend-entry');
  if (!chart.isDatasetVisible(datasetGlobalIndex)) {
    entryHtml.classList.add('hidden');
  }

  const markerColor = (dataset.backgroundColor ?? '#FFFFFF').toString();
  const entryMarkerHtml = createSvgMarker(markerColor, markerStyle);

  const entryNameHtml = createElement('span', 'groupedlegend-entry-name');
  entryNameHtml.innerText = dataset.label ?? '';

  entryHtml.appendChild(entryMarkerHtml);
  entryHtml.appendChild(entryNameHtml);

  // When the dataset name or label is clicked, toggle the dataset visibility
  entryHtml.onclick = (): void => {
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

/**
 * Builds Styles object using passed chart and applies styling to legend container elements.
 */
function applyContainerStyles(chart: Chart, globalContainerHtml: HTMLElement, legendContainerHtml: HTMLElement, canvasContainerHtml: HTMLElement) {
  const styles = new Styles(chart);
  setStyles(globalContainerHtml.style, styles.globalContainer);
  setStyles(legendContainerHtml.style, styles.legendContainer);
  setStyles(canvasContainerHtml.style, styles.canvasContainer);
}

/**
 * Builds Styles object using passed chart and applies styling to legend label elements.
 */
function applyLabelStyles(chart: Chart, legendContainerHtml: HTMLElement) {
  const styles = new Styles(chart);

  const legendElements = (selector: string): NodeListOf<HTMLElement> => legendContainerHtml.querySelectorAll(selector);
  setStylesAll(legendElements('.groupedlegend-group-container'), styles.legendGroupContainer);
  setStylesAll(legendElements('.groupedlegend-group-name'), styles.legendGroupName);
  setStylesAll(legendElements('.groupedlegend-group-entries'), styles.legendGroupEntries);

  setStylesAll(legendElements('.groupedlegend-marker'), styles.legendEntryMarkerBase);
  setStylesAll(legendElements('.groupedlegend-marker.rect'), styles.legendEntryMarkerRect);
  setStylesAll(legendElements('.groupedlegend-marker.circle'), styles.legendEntryMarkerCircle);

  setStylesAll(legendElements('.groupedlegend-entry'), styles.legendGroupEntry);
  setStylesAll(legendElements('.groupedlegend-entry-name'), styles.legendEntryName);

  setStylesAll(legendElements('.hidden'), styles.hidden);
}

export {
  setStyles,
  setStylesAll,
  createElement,
  createGroupNameHtml,
  createLegendEntryHtml,
  findGroupOffset,
  areAllDatasetsHidden,
  determineLegendStyle,
  applyContainerStyles,
  applyLabelStyles,
};
