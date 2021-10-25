import { drawPieSlice, getRandomHexColors } from './utils';

export default class PieChart {
  constructor({ canvas, data, colors = getRandomHexColors(10), centerHoleSize = 0 }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.data = data;
    this.colors = colors;
    this.centerHoleSize = centerHoleSize;
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

      if (this.centerHoleSize !== 0) {
        if (this.centerHoleSize >= 1) {
          throw new Error('centerHoleSize는 1보다 작아야 합니다.');
        }
        drawPieSlice(
          this.ctx,
          centerX,
          centerY,
          this.centerHoleSize * Math.min(centerX, centerY),
          0,
          2 * Math.PI,
          '#fff'
        );
      }
    });
  }
}
