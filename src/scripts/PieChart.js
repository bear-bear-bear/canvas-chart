import { drawPieSlice } from './utils';

export default class PieChart {
  constructor({ canvas, data, colors }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.data = data;
    this.colors = colors;
  }

  draw() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const values = Object.values(this.data);
    const totalValue = values.reduce((acc, curr) => acc + curr, 0);
    let colorIndex = 0;
    let startAngle = 0;

    values.forEach((value) => {
      const sliceAngle = (2 * Math.PI * value) / totalValue;

      drawPieSlice(
        this.ctx,
        centerX,
        centerY,
        Math.min(centerX, centerY),
        startAngle,
        startAngle + sliceAngle,
        this.colors[colorIndex % this.colors.length]
      );

      startAngle += sliceAngle;
      colorIndex++;
    });
  }
}
