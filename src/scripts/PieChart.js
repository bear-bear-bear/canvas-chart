import { drawPieSlice, getGradationHexColors } from './utils';

export default class PieChart {
  constructor({
    canvas,
    legendUL,
    legendAddSection,
    data,
    colors = getGradationHexColors(10),
    centerHoleSize = 0,
  }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.radius = Math.min(this.centerX, this.centerY);
    this.legendUL = legendUL;
    this.legendAddSection = legendAddSection;
    this.eventRemovers = {};
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
    const additionSectionInnerHTML = `
<label>
  이름: <input type="text" name="dataName" required />
</label>
<label>
  값: <input type="number" name="dataValue" min="1" required/>
</label>
<button type="button" id="dataAddButton" title="Add data">데이터 추가 || 수정</button>
    `.trim();
    const getItemInnerHTML = (backgroundColor, dataName, dataValue) => {
      return `
<div style='background-color: ${backgroundColor};'></div>
<span class="data-name" title="${dataName}">${dataName}</span>
<span class="data-value">${dataValue}</span>
<button type="button" id="dataRemoveButton" title="Remove data">X</button>
      `.trim();
    };

    const itemsHTML = this.dataKeys.reduce((acc, currKey, colorIndex) => {
      const backgroundColor = this.colors[colorIndex++ % this.colors.length];
      const currItemInnerHTML = getItemInnerHTML(
        backgroundColor,
        currKey,
        this.sortedData[currKey]
      );
      const currItemHTML = `<li>${currItemInnerHTML}</li>`;

      return acc + currItemHTML;
    }, '');

    const handleRemoveButtonClick = (e) => {
      e.stopPropagation();
      if (e.target.tagName !== 'BUTTON') return;
      if (e.path[0].id !== 'dataRemoveButton') return;

      e.target.closest('li').remove();
    };

    const handleAddSectionButtonClick = (e) => {
      e.stopPropagation();
      if (e.target.tagName !== 'BUTTON') return;
      if (e.path[0].id !== 'dataAddButton') return;

      const [nameInput, valueInput] = this.legendAddSection.querySelectorAll('input');
      const randomColorIndex = Math.floor(Math.random() * this.colors.length);
      const backgroundColor = this.colors[randomColorIndex];
      const willAddItemInnerHTML = getItemInnerHTML(
        backgroundColor,
        nameInput.value,
        valueInput.value
      );

      const li = document.createElement('li');
      li.innerHTML = willAddItemInnerHTML;
      this.legendUL.appendChild(li);
    };

    this.legendUL.innerHTML = itemsHTML;
    this.legendAddSection.innerHTML = additionSectionInnerHTML;
    this.legendUL.addEventListener('click', handleRemoveButtonClick, false);
    this.legendAddSection.addEventListener('click', handleAddSectionButtonClick, false);

    this.eventRemovers = {
      legendUL: () => {
        this.legendUL.removeEventListener('click', handleRemoveButtonClick, false);
      },
      legendAddSection: () => {
        this.legendAddSection.removeEventListener('click', handleAddSectionButtonClick, false);
      },
    };
  }

  draw() {
    this.#initData();
    this.#drawChart();
    this.#drawLabel();
    this.#drawLegend();
    if (this.centerHoleSize) this.#drawCenterHole();
  }

  clear() {
    this.legendUL.innerHTML = '';
    this.legendAddSection.innerHTML = '';
    for (const param in this.eventRemovers) {
      this.eventRemovers[param]();
    }

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
