import PieChart from './PieChart';
import initialData from './data';
import { getGradationHexColors, createSessionStorageHelper } from './utils';

const canvas = document.getElementById('canvas');
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

const chart = new PieChart({
  canvas,
  legend,
  data: getter.data(),
  colors: getter.colors(),
  centerHoleSize: getter.centerHoleSize(),
});

const reDrawChart = (willChangeParamNames = ['']) => {
  legend.innerHTML = '';
  chart.clear();

  const willChangeParams = willChangeParamNames.reduce((acc, paramName) => {
    acc[paramName] = getter[paramName]();
    return acc;
  }, {});

  chart.set(willChangeParams);
  chart.draw();
};

const handleRandomColorButtonClick = () => {
  const savedData = getter.data();
  const data = savedData || initialData;
  const randomColors = getGradationHexColors(Object.keys(data).length);
  setter.colors(randomColors);

  reDrawChart(['colors']);
};

const handleCenterHoleSizeRangeChange = (e) => {
  const nextCenterHoleSize = e.target.value / 10;
  setter.centerHoleSize(nextCenterHoleSize);

  reDrawChart(['centerHoleSize']);
};

const init = () => {
  chart.draw();

  randomColorButton.addEventListener('click', handleRandomColorButtonClick, false);
  centerHoleSizeRange.addEventListener('change', handleCenterHoleSizeRangeChange, false);
};

init();
