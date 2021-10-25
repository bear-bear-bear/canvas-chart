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
