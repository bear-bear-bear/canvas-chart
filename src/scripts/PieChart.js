import { drawPieSlice, getGradationHexColors } from './utils';

export default class PieChart {
  constructor({ canvas, legend, data, colors = getGradationHexColors(10), centerHoleSize = 0 }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.radius = Math.min(this.centerX, this.centerY);
    this.legend = legend;
    this.colors = colors;
    this.centerHoleSize = centerHoleSize;
    this.data = data;
    this.sortedData = {};
    this.dataKeys = [];
    this.dataValues = [];
    this.totalValue = 0;
  }

  #initData() {
    this.sortedData = Object.fromEntries(Object.entries(this.data).sort(([, a], [, b]) => b - a)); // 내림차순 정렬
    this.dataKeys = Object.keys(this.sortedData);
    this.dataValues = Object.values(this.sortedData);
    this.totalValue = this.dataValues.reduce((acc, curr) => acc + curr, 0);
  }

  #drawChart() {
    let colorIndex = 0;
    let startAngle = 0;

    this.dataValues.forEach((value) => {
      const sliceAngle = (2 * Math.PI * value) / this.totalValue;

      drawPieSlice(
        this.ctx,
        this.centerX,
        this.centerY,
        this.radius,
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
      this.centerHoleSize * this.radius,
      0,
      2 * Math.PI,
      '#fff'
    );
  }

  #drawLabel() {
    let startAngle = 0;

    this.dataValues.forEach((value) => {
      const sliceAngle = (2 * Math.PI * value) / this.totalValue;
      let labelX = this.centerX + (this.radius / 2) * Math.cos(startAngle + sliceAngle / 2);
      let labelY = this.centerY + (this.radius / 2) * Math.sin(startAngle + sliceAngle / 2);

      if (this.centerHoleSize) {
        const offset = (this.radius * this.centerHoleSize) / 2;
        labelX = this.centerX + (offset + this.radius / 2) * Math.cos(startAngle + sliceAngle / 2);
        labelY = this.centerY + (offset + this.radius / 2) * Math.sin(startAngle + sliceAngle / 2);
      }

      const valuePercentage = `${Math.round((100 * value) / this.totalValue)}%`;
      const Label_Pos_Fix_Value = 12;

      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 1.3rem san-serif';
      this.ctx.fillText(
        valuePercentage,
        labelX - Label_Pos_Fix_Value,
        labelY + Label_Pos_Fix_Value
      );

      startAngle += sliceAngle;
    });
  }

  #drawLegend() {
    let colorIndex = 0;
    const legendHTML = this.dataKeys.reduce((acc, currKey) => {
      const currHTML = `
<div style='display: flex; gap: 0.5rem'>
  <div style='width: 1.3rem; height: 1.3rem; background-color: ${
    this.colors[colorIndex++ % this.colors.length]
  };'></div>
  ${currKey}<span style='color: #777'>(${this.sortedData[currKey]})</span>
</div>
      `.trim();

      return acc + currHTML;
    }, '');
    this.legend.innerHTML = legendHTML;
  }

  draw() {
    this.#initData();
    this.#drawChart();
    this.#drawLabel();
    this.#drawLegend();
    if (this.centerHoleSize) this.#drawCenterHole();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
  }

  set(changableParams) {
    for (const param in changableParams) {
      if (!(param in this)) return;
      if (param === 'data') this.#initData();

      this[param] = changableParams[param];
    }
  }
}
