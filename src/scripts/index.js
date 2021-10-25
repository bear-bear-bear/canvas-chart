import PieChart from './PieChart';
import data from './data';

const canvas = document.getElementById('canvas');
const legend = document.getElementById('legend');

const pieChart = new PieChart({
  canvas,
  legend,
  data,
  colors: ['#fde23e', '#f16e23', '#57d9ff', '#937e88'],
  centerHoleSize: 0.4,
});

pieChart.draw();
