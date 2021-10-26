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

export const getRandomHexColors = (num) =>
  Array(num)
    .fill('')
    .map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));

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
