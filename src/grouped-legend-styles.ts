import { Chart, ChartOptions, FontSpec } from 'chart.js';
import { resolve, toFont } from 'chart.js/helpers';

export class Styles {
  private static chartOptions: ChartOptions;

  static initialize(chart: Chart): void {
    this.chartOptions = chart.options;
  }

  static get hidden(): Partial<CSSStyleDeclaration> {
    return {
      textDecoration: 'line-through',
      textDecorationThickness: '0.24em',
    };
  }

  static get canvasContainer(): Partial<CSSStyleDeclaration> {
    return {
      maxHeight: '100%',
      minHeight: '0',
      flexGrow: '1',
    };
  }

  static get legendContainer(): Partial<CSSStyleDeclaration> {
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

  static get legendGroupContainer(): Partial<CSSStyleDeclaration> {
    return {
      display: 'flex',
      flexDirection: 'column',
      color: resolve([this.chartOptions.color, Chart.defaults.color])?.toString(),
    };
  }

  static get legendGroupName(): Partial<CSSStyleDeclaration> {
    return {
      textAlign: 'center',
    };
  }

  static get legendGroupEntries(): Partial<CSSStyleDeclaration> {
    return {
      flexGrow: '1',
      listStyle: 'none',
      paddingLeft: '0',
    };
  }

  static get legendGroupEntry(): Partial<CSSStyleDeclaration> {
    return {
      padding: '0',
      marginRight: '0.5em',
      display: 'inline-flex',
      alignItems: 'center',
    };
  }

  static get legendEntryMarkerBase(): Partial<CSSStyleDeclaration> {
    return {
      boxShadow: '0px 0px 0.8px 0px rgba(0, 0, 0, 0.5)',
      marginRight: '0.35em',
      display: 'inline-block',
    };
  }

  static get legendEntryMarkerRect(): Partial<CSSStyleDeclaration> {
    return {
      height: '1em',
      maxWidth: '3.3em',
      minWidth: '3.3em',
    };
  }

  static get legendEntryMarkerCircle(): Partial<CSSStyleDeclaration> {
    return {
      height: '1.45em',
      maxWidth: '1.45em',
      minWidth: '1.45em',
      borderRadius: '50%',
    };
  }

  static get legendEntryName(): Partial<CSSStyleDeclaration> {
    return {
      height: '100%',
      display: 'inline-block',
    };
  }
}
