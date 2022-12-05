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

  get canvasContainer(): Partial<CSSStyleDeclaration> {
    return {
      maxHeight: '100%',
      minHeight: '0',
      flexGrow: '1',
    };
  }

  get legendContainer(): Partial<CSSStyleDeclaration> {
    const font = toFont(this.chartOptions.plugins?.legend?.labels?.font as Partial<FontSpec>);
    return {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      maxHeight: '100%',
      cursor: 'default',
      font: font.string,
      paddingLeft: '1em',
      paddingRight: '1em',
      // toFont returns canvas-friendly values, so lineHeight needs to be used with a px unit
      lineHeight: `${font.lineHeight}px`,
    };
  }

  get legendGroupContainer(): Partial<CSSStyleDeclaration> {
    return {
      display: 'flex',
      flexDirection: 'column',
      color: resolve([this.chartOptions.color, Chart.defaults.color])?.toString(),
    };
  }

  get legendGroupName(): Partial<CSSStyleDeclaration> {
    return {
      textAlign: 'center',
    };
  }

  get legendGroupEntries(): Partial<CSSStyleDeclaration> {
    return {
      flexGrow: '1',
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
