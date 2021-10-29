import PieChart from './PieChart.js';
import * as initialValues from './initialValues.js';
import { getGradationHexColors, getSessionStorageHelper } from './utils.js';

const canvas = document.getElementById('canvas');
const legendUL = document.getElementById('legendUL');
const legendAddSection = document.getElementById('legendAddSection');
const randomColorButton = document.getElementById('randomColorButton');
const centerHoleSizeRange = document.getElementById('centerHoleSizeRange');
const sortLegendButton = document.getElementById('sortLegendButton');
const initialDataCallButton = document.getElementById('initialDataCallButton');

const { getter, setter } = getSessionStorageHelper([
  {
    name: 'data',
    initialValue: initialValues.data,
  },
  {
    name: 'colors',
    initialValue: initialValues.colors,
  },
  {
    name: 'centerHoleSize',
    initialValue: initialValues.centerHoleSize,
  },
]);

const chart = new PieChart({
  canvas,
  legendUL,
  legendAddSection,
  data: getter.data(),
  colors: getter.colors(),
  centerHoleSize: getter.centerHoleSize(),
});

const reDrawChart = (willChangeParamNames = []) => {
  chart.clear();

  const willChangeParams = willChangeParamNames.reduce((acc, paramName) => {
    acc[paramName] = getter[paramName]();
    return acc;
  }, {});

  chart.set(willChangeParams);
  chart.draw();
};

const initCenterHoleSizeRange = () => {
  centerHoleSizeRange.value = getter.centerHoleSize()
    ? getter.centerHoleSize() * 10
    : centerHoleSizeRange.value;
};

const registerLegendObserver = () => {
  const observer = new MutationObserver((mutations) => {
    const isReDraw = mutations.length !== 1; // When redrawing, mutations length becomes 2, because addition and removal are done at the same time.
    if (isReDraw) return;

    const { addedNodes, removedNodes } = mutations[0];
    const mutateType = addedNodes[0] ? 'added' : 'removed';

    console.log(mutateType);

    switch (mutateType) {
      case 'added': {
        const addedItem = addedNodes[0];
        const dataName = addedItem.querySelector('.data-name').textContent;
        const dataValue = Number(addedItem.querySelector('.data-value').textContent);
        const nextData = { ...getter.data(), [dataName]: dataValue };
        setter.data(nextData);

        break;
      }
      case 'removed': {
        const removedItem = removedNodes[0];
        const willRemoveDataName = removedItem.querySelector('.data-name').textContent;
        // eslint-disable-next-line no-unused-vars
        const { [willRemoveDataName]: _, ...nextData } = getter.data();
        setter.data(nextData);

        break;
      }
      default:
    }

    reDrawChart(['data']);
  });

  observer.observe(legendUL, { childList: true });
};

const eventHandler = {
  randomColorButtonClick: () => {
    const savedData = getter.data();
    const data = savedData || initialValues.data;
    const randomColors = getGradationHexColors(Object.keys(data).length);
    setter.colors(randomColors);

    reDrawChart(['colors']);
  },

  centerHoleSizeRangeChange: (e) => {
    const nextCenterHoleSize = e.target.value / 10;
    setter.centerHoleSize(nextCenterHoleSize);

    reDrawChart(['centerHoleSize']);
  },

  sortLegendButtonClick: () => {
    location.reload();
  },

  initialDataCallButtonClick: () => {
    window.sessionStorage.clear();
    location.reload();
  },
};

const init = () => {
  chart.draw();

  initCenterHoleSizeRange();
  registerLegendObserver();

  centerHoleSizeRange.addEventListener('change', eventHandler.centerHoleSizeRangeChange, false);
  randomColorButton.addEventListener('click', eventHandler.randomColorButtonClick, false);
  sortLegendButton.addEventListener('click', eventHandler.sortLegendButtonClick, false);
  initialDataCallButton.addEventListener('click', eventHandler.initialDataCallButtonClick, false);
};

init();
