/**
 * @param {number} startX 선 시작점의 X 좌표
 * @param {number} startY 선 시작점의 Y 좌표
 * @param {number} endX 선 끝점의 X 좌표
 * @param {number} endY 선 끝점의 Y 좌표
 */
export const drawLine = (ctx, startX, startY, endX, endY) => {
  ctx.beginPath(); // 캔버스에 새로운 것을 그리기 시작하고 있음을 드로잉 컨텍스트에 알림
  ctx.moveTo(startX, startY); // 시작점을 설정
  ctx.lineTo(endX, endY); // 끝점을 표시
  ctx.stroke(); // 실제 그리기를 수행
};

/**
 * @param {number} centerX 원 중심의 X 좌표
 * @param {number} centerY 원 중심의 Y 좌표
 * @param {number} startAngle 원의 일부가 시작되는 시작 각도(라디안)
 * @param {number} endAngle 원의 일부가 끝나는 끝 각도(라디안)
 */
export const drawArc = (ctx, centerX, centerY, radius, startAngle, endAngle) => {
  ctx.beginPath(); // 캔버스에 새로운 것을 그리기 시작하고 있음을 드로잉 컨텍스트에 알림
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.stroke(); // 실제 그리기를 수행
};

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

export const getRandomHexColors = (num = 100) =>
  Array(num)
    .fill('')
    .map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));
