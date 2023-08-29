import Chart from 'chart.js/auto';
import { GroupedLegend } from '@opeepl/chartjs-plugin-groupedlegend/dist/index.js';

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const tickLabels = ['Tick label 1', 'Tick label 2', 'Tick label 3'];
const seriesLabels = ['Serie 1', 'Serie 2', 'Serie 3'];
const rangeMin = 1;
const rangeMax = 10;
const greenColors = ['green', 'darkgreen', 'lawngreen'];
const blueColors = ['blue', 'darkblue', 'lightblue'];

const createGroup = (colors) => {
    return seriesLabels.map((label, index) => {
        return {
            label: label,
            data: tickLabels.map((tickLabel) => {
                return {
                    count: randomInt(rangeMin, rangeMax),
                    label: tickLabel,
                };
            }),
            borderColor: colors[index],
            backgroundColor: colors[index],
        };
    });
}

const greenGroup = createGroup(greenColors);
const blueGroup = createGroup(blueColors);

const groups = [
    {
        name: 'Greens',
        datasets: greenGroup,
    },
    {
        name: 'Blues',
        datasets: blueGroup,
    },
];

const allDatasets = greenGroup.concat(blueGroup);

const data = {
    labels: tickLabels,
    datasets: allDatasets,
};

const options = {
    plugins: {
        groupedlegend: {
            groups: groups,
            display: true,
        },
        legend: {
            display: false,
        },
    },
    parsing: {
        xAxisKey: 'label',
        yAxisKey: 'count',
    },
};

new Chart('chart', {
    type: 'line',
    options: options,
    data: data,
    plugins: [GroupedLegend],
});
