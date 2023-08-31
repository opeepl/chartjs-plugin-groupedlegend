# chartjs-plugin-groupedlegend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A grouped legend plugin for ChartJS 3 and 4 written in TypeScript.

Allows you to group datasets using HTML legend:

![Sample](docs/sample.png)

## Installation

```bash
npm install chartjs-plugin-groupedlegend
```

## Usage

Check out the example [here](/example/). Run the code with `npm run dev`.

## Options

| Option name | Type                    | Default value | Description                    |
| ----------- | ----------------------- | ------------- | ------------------------------ |
| `display`   | `boolean`               | `true`        | Whether to display the legend. |
| `position`  | `GroupedLegendPosition` | `'top'`       | The position of the legend.    |
| `groups`    | `Array<DatasetGroup>`   | `[]`          | The groups of the legend.      |

`GroupeLegendPosition` is a string with the following possible values:

-   `'top'`
-   `'left'`
-   `'bottom'`
-   `'right'`

`DatasetGroup` is an object with the following properties:

-   `name`: The name of the group.
-   `datasets`: An array of `ChartDataset` objects.

## License

MIT
