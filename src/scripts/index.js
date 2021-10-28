import PieChart from './PieChart';
import initialData from './initialData.json';
import { getGradationHexColors, getSessionStorageHelper } from './utils';

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
  const observer = new MutationObserver(([mutation]) => {
    const mutateType = mutation.addedNodes[0] ? 'added' : 'removed';
    const isReDraw = mutation.addedNodes.length > 1 || mutation.removedNodes.length > 1;
    if (isReDraw) return;
    console.log(mutation);
    console.log(mutateType);

    switch (mutateType) {
      case 'added': {
        const addedItem = mutation.addedNodes[0];
        const dataName = addedItem.querySelector('.data-name').textContent;
        const dataValue = Number(addedItem.querySelector('.data-value').textContent);
        const nextData = { ...getter.data(), [dataName]: dataValue };
        setter.data(nextData);

        break;
      }
      case 'removed': {
        // FIXME: 시각적으로 보이는 데이터 li 개수가 2개 일때 X 버튼을 누르면, 버튼 클릭 이벤트는 1회인데 옵저버 removed 이벤트는 3회 연속 일어나버림
        const currData = getter.data();
        const dataLength = Object.keys(currData).length;
        if (dataLength === 1) return; // 위 이슈의 임시방편

        const removedItem = mutation.removedNodes[0];
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
    const data = savedData || initialData;
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
