import { Chart, ChartOptions } from 'chart.js';
import { valueOrDefault } from 'chart.js/helpers';

export class Styles {
  private static chartDefaults: ChartOptions;

  static setDefaultsFromChart(chart: Chart): void {
    this.chartDefaults = chart.options;
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
    return {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      maxHeight: '100%',
      cursor: 'default',
    };
  }

  static get legendGroupContainer(): Partial<CSSStyleDeclaration> {
    return {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '0.5rem',
      marginRight: '0.5rem',
      fontSize: `${valueOrDefault(this.chartDefaults.font.size, Chart.defaults.font.size)}px`,
      fontFamily: valueOrDefault(this.chartDefaults.font.family, Chart.defaults.font.family),
      fontStyle: valueOrDefault(this.chartDefaults.font.style, Chart.defaults.font.style),
      fontWeight: valueOrDefault(this.chartDefaults.font.weight, Chart.defaults.font.weight),
      lineHeight: valueOrDefault(this.chartDefaults.font.lineHeight, Chart.defaults.font.lineHeight).toString(),
      color: valueOrDefault(this.chartDefaults.color, Chart.defaults.color).toString(),
    };
  }

  static get legendGroupName(): Partial<CSSStyleDeclaration> {
    return {
      textAlign: 'center',
    };
  }

  static get legendGroup(): Partial<CSSStyleDeclaration> {
    return {
      flexGrow: '1',
      listStyle: 'none',
      paddingLeft: '0',
    };
  }

  static get legendEntry(): Partial<CSSStyleDeclaration> {
    return {
      padding: '0',
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: '20px',
      marginLeft: '10px',
    };
  }

  static get legendEntryMarkerBase(): Partial<CSSStyleDeclaration> {
    return {
      boxShadow: '0px 0px 0.8px 0px rgba(0, 0, 0, 0.5)',
      marginRight: '6px',
      display: 'inline-block',
    };
  }

  static get legendEntryMarkerRect(): Partial<CSSStyleDeclaration> {
    return {
      height: '12px',
      maxWidth: '40px',
      minWidth: '40px',
    };
  }

  static get legendEntryMarkerCircle(): Partial<CSSStyleDeclaration> {
    return {
      height: '18px',
      maxWidth: '18px',
      minWidth: '18px',
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
