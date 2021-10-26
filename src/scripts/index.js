import PieChart from './PieChart';
import initialData from './data';
import { getRandomHexColors, createSessionStorageHelper } from './utils';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const legend = document.getElementById('legend');
const randomColorButton = document.getElementById('randomColorButton');
const centerHoleSizeRange = document.getElementById('centerHoleSizeRange');

const { getter, setter } = createSessionStorageHelper([
  {
    name: 'data',
    initialValue: initialData,
  },
  {
    name: 'colors',
    initialValue: ['#fde23e', '#f16e23', '#57d9ff', '#937e88'],
  },
  {
    name: 'centerHoleSize',
    initialValue: 0.4,
  },
]);

const drawChart = () => {
  const pieChart = new PieChart({
    canvas,
    legend,
    data: getter.data(),
    colors: getter.colors(),
    centerHoleSize: getter.centerHoleSize(),
  });

  pieChart.draw();
};

const reDrawChart = () => {
  legend.innerHTML = '';

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  drawChart();
};

const handleRandomColorButtonClick = () => {
  const savedData = getter.data();
  const data = savedData || initialData;
  const randomColors = getRandomHexColors(Object.keys(data).length);
  setter.colors(randomColors);

  reDrawChart();
};

const handleCenterHoleSizeRangeChange = (e) => {
  const nextCenterHoleSize = e.target.value / 10;
  setter.centerHoleSize(nextCenterHoleSize);

  reDrawChart();
};

const init = () => {
  drawChart();

  randomColorButton.addEventListener('click', handleRandomColorButtonClick, false);
  centerHoleSizeRange.addEventListener('change', handleCenterHoleSizeRangeChange, false);
};

init();
