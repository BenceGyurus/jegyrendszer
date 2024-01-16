const drawSeat = (x:number, y:number, isAvailable:boolean, isSelected:boolean, pending:boolean, disabled:boolean, ctx:any, width:number, height:number, colorOfSeat:string) => {
    const seatHeight = height;
    const cornerRadius = 2;

    const gradient = ctx.createLinearGradient(x, y, x, y + seatHeight);
    if (isSelected) {
      gradient.addColorStop(0,'#3DA4FF'); // Blue for available, red for occupied
      gradient.addColorStop(1,'#3496E2');
    }else{
      gradient.addColorStop(0, pending ? "yellow" : isAvailable ? disabled ? "grey" :  colorOfSeat : '#FF6767'); // Blue for available, red for occupied
      gradient.addColorStop(1, pending ? "yellow" : isAvailable ? disabled ?  "grey"  : "rgba(0,0,0,0.9)" : '#FF5E5E'); // Slightly darker shade
    }

    ctx.beginPath();
    ctx.moveTo(x + cornerRadius, y);
    ctx.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);
    ctx.arcTo(x + width, y + seatHeight, x + width - cornerRadius, y + seatHeight, cornerRadius);
    ctx.arcTo(x, y + seatHeight, x, y + seatHeight - cornerRadius, cornerRadius);
    ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();

  };

  export default drawSeat;