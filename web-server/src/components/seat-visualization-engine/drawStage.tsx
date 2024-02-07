import typeOfDrawStageParams from "./types/typeOfDrawStageParams";

const drawStage = (
  x: number,
  y: number,
  width: number,
  height: number,
  ctx: any,
) => {
  const seatHeight = height;
  const cornerRadius = 2;

  const gradient = ctx.createLinearGradient(x, y, x, y + seatHeight);
  gradient.addColorStop(0, "#3d3d3d");
  gradient.addColorStop(1, "#616161");

  ctx.beginPath();
  ctx.moveTo(x + cornerRadius, y);
  ctx.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);
  ctx.arcTo(
    x + width,
    y + seatHeight,
    x + width - cornerRadius,
    y + seatHeight,
    cornerRadius,
  );
  ctx.arcTo(x, y + seatHeight, x, y + seatHeight - cornerRadius, cornerRadius);
  ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
  ctx.closePath();

  ctx.fillStyle = gradient;
  ctx.fill();
  const title = "SZÍNPAD";
  const titleFontSize =
    seatHeight * 0.7 < (width / title.length) * 0.7
      ? seatHeight * 0.7
      : width / title.length;
  ctx.font = `${titleFontSize}px Arial`;
  ctx.fillStyle = "#fff"; // Customize text color
  ctx.fillText(
    title,
    x + width / 2 - ctx.measureText(title).width / 2,
    y + seatHeight / 2 + titleFontSize / 2,
  );
};

export default drawStage;
