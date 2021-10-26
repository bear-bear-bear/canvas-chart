/**
 * @param {string} color 채우기 색상
 * @param {number} centerX 원 중심의 X 좌표
 * @param {number} centerY 원 중심의 Y 좌표
 * @param {number} radius 반지름
 * @param {number} startAngle 원의 일부가 시작되는 시작 각도(라디안)
 * @param {number} endAngle 원의 일부가 끝나는 끝 각도(라디안)
 */
export const drawPieSlice = (ctx, centerX, centerY, radius, startAngle, endAngle, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fill();
};

/**
 * @param {Number} num 반환할 색상의 개수
 */
export const getGradationHexColors = (num) => {
  const getRandomInt = (_min, _max) => {
    const min = Math.floor(_min);
    const max = Math.ceil(_max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const randomColorDec = getRandomInt(6000000, 12500000); // excepted too much brightness or darkness (0~16777216)
  const GRADIENT_DEGREE = 1750;
  const isAscending = randomColorDec - num * GRADIENT_DEGREE < 0;

  const { hexColors } = Array(num)
    .fill('')
    .reduce(
      ({ hexColors, nextColorDec }) => {
        const hexColor = `#${nextColorDec.toString(16).padStart(6, 0)}`;
        return {
          hexColors: hexColors.concat(hexColor),
          nextColorDec: isAscending
            ? nextColorDec + GRADIENT_DEGREE
            : nextColorDec - GRADIENT_DEGREE,
        };
      },
      { hexColors: [], nextColorDec: randomColorDec }
    );

  return hexColors;
};

/**
 * @param {Array.<{name: String, initialValue: *}>} dataInfo
 * 세션 스토리지 내에서 쓰일 이름과 해당 데이터의 초기값으로 구성된 객체의 배열
 *
 * @returns {{ getter: { [name: String]: () => value }, setter: { [name: String]: (value) => void } }}
 */
export const createSessionStorageHelper = (dataInfo) => {
  const getter = dataInfo.reduce((acc, { name, initialValue }) => {
    acc[name] = () => {
      const savedValue = JSON.parse(window.sessionStorage.getItem(name));
      return savedValue || initialValue;
    };
    return acc;
  }, {});

  const setter = dataInfo.reduce((acc, { name }) => {
    acc[name] = (nextValue) => {
      window.sessionStorage.setItem(name, JSON.stringify(nextValue));
    };
    return acc;
  }, {});

  return { getter, setter };
};
