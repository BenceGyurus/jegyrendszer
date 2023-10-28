import React, { useEffect, useRef, useState } from "react";

const SeatingChart = () => {
  const canvasRef:any = useRef(null);
  const [groups, setGroups] = useState([
    [
      { x: 100, y: 100, grouped: true },
      { x: 150, y: 100, grouped: true },
      { x: 200, y: 100, grouped: true },
    ],
    [
      { x: 100, y: 200, grouped: true },
      { x: 150, y: 200, grouped: true },
      { x: 200, y: 200, grouped: true },
    ],
    // Add more groups here
  ]);
  const [zoomedGroup, setZoomedGroup] = useState(null);
  const [showMoreSeats, setShowMoreSeats] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    function drawSeats() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      groups.forEach((group, groupIndex) => {
        group.forEach((seat, seatIndex) => {
          if (!zoomedGroup || zoomedGroup === groupIndex || showMoreSeats) {
            ctx.fillStyle = seat.grouped ? "blue" : "red";
            ctx.fillRect(seat.x, seat.y, 20, 20);

            if (zoomedGroup === groupIndex) {
              // Display seat details or other content here
              ctx.fillStyle = "white";
              ctx.fillText(`Seat ${seatIndex + 1}`, seat.x, seat.y);
            }
          }
        });
      });
    }

    drawSeats();

    canvas.addEventListener("click", (event:any) => {
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - canvas.getBoundingClientRect().top;

      groups.forEach((group, groupIndex:any) => {
        group.forEach((seat) => {
          const distance = Math.sqrt(
            (mouseX - seat.x) ** 2 + (mouseY - seat.y) ** 2
          );
          if (distance < 20) {
            if (!zoomedGroup || zoomedGroup !== groupIndex) {
              setZoomedGroup(groupIndex);
              setShowMoreSeats(true);
            } else {
              setShowMoreSeats(!showMoreSeats);
            }
          }
        });
      });
      drawSeats();
    });
  }, [zoomedGroup, groups, showMoreSeats]);

  return <canvas ref={canvasRef} width={300} height={300}></canvas>;
};

export default SeatingChart;
