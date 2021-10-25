import PieChart from './PieChart';
import data from './data';

const canvas = document.getElementById('canvas');
canvas.width = 300;
canvas.height = 300;

const pieChart = new PieChart({
  canvas,
  data,
  // colors: ['#fde23e', '#f16e23', '#57d9ff', '#937e88'],
  centerHoleSize: 0.5,
});

pieChart.draw();
