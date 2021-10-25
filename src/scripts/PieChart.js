import { drawPieSlice, getRandomHexColors } from './utils';

export default class PieChart {
  constructor({ canvas, data, colors = getRandomHexColors(10), centerHoleSize = 0 }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.data = data;
    this.colors = colors;
    this.centerHoleSize = centerHoleSize;
  }

  #drawChart() {
    const values = Object.values(this.data);
    const totalValue = values.reduce((acc, curr) => acc + curr, 0);
    let colorIndex = 0;
    let startAngle = 0;

    values.forEach((value) => {
      const sliceAngle = (2 * Math.PI * value) / totalValue;

      drawPieSlice(
        this.ctx,
        this.centerX,
        this.centerY,
        Math.min(this.centerX, this.centerY),
        startAngle,
        startAngle + sliceAngle,
        this.colors[colorIndex % this.colors.length]
      );

      startAngle += sliceAngle;
      colorIndex++;
    });
  }

  #drawCenterHole() {
    if (this.centerHoleSize >= 1) {
      throw new Error('centerHoleSize는 1보다 작아야 합니다.');
    }

    drawPieSlice(
      this.ctx,
      this.centerX,
      this.centerY,
      this.centerHoleSize * Math.min(this.centerX, this.centerY),
      0,
      2 * Math.PI,
      '#fff'
    );
  }

  draw() {
    this.#drawChart();
    if (this.centerHoleSize) this.#drawCenterHole();
  }
}
