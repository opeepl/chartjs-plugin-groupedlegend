import { Chart, ChartOptions, FontSpec } from 'chart.js';
import { resolve, toFont } from 'chart.js/helpers';

export class Styles {
  private chartOptions: ChartOptions;

  constructor(chart: Chart) {
    this.chartOptions = chart.options;
  }

  get hidden(): Partial<CSSStyleDeclaration> {
    return {
      textDecoration: 'line-through',
      textDecorationThickness: '0.24em',
    };
  }

  get globalContainer(): Partial<CSSStyleDeclaration> {
    const position = this.chartOptions.plugins?.groupedlegend?.position ?? 'top';
    return {
      display: 'flex',
      flexDirection: ['top', 'bottom'].includes(position) ? 'column' : 'row',
      flexGrow: '1',
      flexShrink: '1',
      overflow: 'hidden',
    };
  }

  get canvasContainer(): Partial<CSSStyleDeclaration> {
    return {
      maxHeight: '100%',
      minHeight: '0',
      maxWidth: '100%',
      minWidth: '0',
      flex: '1',
    };
  }

  get legendContainer(): Partial<CSSStyleDeclaration> {
    const font = toFont(this.chartOptions.plugins?.legend?.labels?.font as Partial<FontSpec>);
    const position = this.chartOptions.plugins?.groupedlegend?.position ?? 'top';
    const display = this.chartOptions.plugins?.groupedlegend?.display ?? true;
    return {
      display: display ? 'flex' : 'none',
      flexDirection: 'row',
      flexWrap: 'wrap',
      writingMode: ['top', 'bottom'].includes(position) ? 'horizontal-tb' : 'vertical-lr',
      gap: '0.75em',
      order: ['top', 'left'].includes(position) ? '0' : '1',
      cursor: 'default',
      font: font.string,
      paddingLeft: '1em',
      paddingRight: '1em',
      // toFont returns canvas-friendly values, so lineHeight needs to be used with a px unit
      lineHeight: `${font.lineHeight}px`,
      maxHeight: ['left', 'right'].includes(position) ? '100%' : '50%',
      maxWidth: ['top', 'bottom'].includes(position) ? '100%' : '50%',
      minWidth: '0',
    };
  }

  get legendGroupContainer(): Partial<CSSStyleDeclaration> {
    return {
      display: 'flex',
      flexDirection: 'column',
      color: resolve([this.chartOptions.color, Chart.defaults.color])?.toString(),
      writingMode: 'horizontal-tb',
      width: 'min-content',
      flexGrow: '1',
      placeContent: 'center',
    };
  }

  get legendGroupName(): Partial<CSSStyleDeclaration> {
    return {
      textAlign: 'center',
    };
  }

  get legendGroupEntries(): Partial<CSSStyleDeclaration> {
    return {
      listStyle: 'none',
      paddingLeft: '0',
    };
  }

  get legendGroupEntry(): Partial<CSSStyleDeclaration> {
    return {
      padding: '0',
      marginRight: '0.5em',
      display: 'inline-flex',
      alignItems: 'center',
    };
  }

  get legendEntryMarkerBase(): Partial<CSSStyleDeclaration> {
    return {
      boxShadow: '0px 0px 0.8px 0px rgba(0, 0, 0, 0.5)',
      marginRight: '0.35em',
      display: 'inline-block',
    };
  }

  get legendEntryMarkerRect(): Partial<CSSStyleDeclaration> {
    return {
      height: '1em',
      maxWidth: '3.3em',
      minWidth: '3.3em',
    };
  }

  get legendEntryMarkerCircle(): Partial<CSSStyleDeclaration> {
    return {
      height: '1.45em',
      maxWidth: '1.45em',
      minWidth: '1.45em',
      borderRadius: '50%',
    };
  }

  get legendEntryName(): Partial<CSSStyleDeclaration> {
    return {
      height: '100%',
      display: 'inline-block',
    };
  }
}
