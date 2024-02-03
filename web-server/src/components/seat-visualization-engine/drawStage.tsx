import typeOfDrawStageParams from "./types/typeOfDrawStageParams";

const drawStage = ({x,y,width,height,ctx}:typeOfDrawStageParams)=>{
    const seatHeight = height;
    const cornerRadius = 2;

    const gradient = ctx.createLinearGradient(x, y, x, y + seatHeight);
    gradient.addColorStop(0, '#FF6767');
    gradient.addColorStop(1, '#FF5E5E');

    ctx.beginPath();
    ctx.moveTo(x + cornerRadius, y);
    ctx.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);
    ctx.arcTo(x + width, y + seatHeight, x + width - cornerRadius, y + seatHeight, cornerRadius);
    ctx.arcTo(x, y + seatHeight, x, y + seatHeight - cornerRadius, cornerRadius);
    ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();
}