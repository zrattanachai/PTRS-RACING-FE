import React, { useEffect, useRef } from 'react';

const GForceMeter = ({ gForceData }) => {
  const canvasRef = useRef(null);
  const padding = 15; // Define padding from the edge

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const devicePixelRatio = window.devicePixelRatio || 1;
    const container = canvas.parentElement;
    const { width } = container.getBoundingClientRect();
    const height = width; // Maintain a square aspect ratio

    // Set canvas dimensions
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    // Adjust the canvas style size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Scale the drawing context to match the pixel ratio
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const radius = (Math.min(canvas.width, canvas.height) / devicePixelRatio/1.5 - 2 * padding) / 2;
    const centerX = canvas.width / (2 * devicePixelRatio);
    const centerY = canvas.height / (2 * devicePixelRatio /1.3);
    
    // const radius = (Math.min(canvas.width, canvas.height) - 2 * padding) / 2;
    // const centerX = canvas.width / 2;
    // const centerY = canvas.height / 2;

    const drawCircle = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
        
      // Draw outermost circle with black color
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 15, 0, 2 * Math.PI);
      ctx.fillStyle = '#242424'; // Black color for the outer circle
      ctx.fill();

      // Draw outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ffffff';
      ctx.fillStyle = '#242424'; // Black color for the outer circle
      ctx.fill();
      ctx.stroke();

      // Draw inner circles at 25%, 50%, and 75% of the radius
      [0.25, 0.5, 0.75].forEach((factor) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * factor, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ffffff';
        if (factor === 0.25 || factor === 0.75) {
          ctx.setLineDash([1.2, 1.2]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
      });

      // Reset line dash for other drawings
      ctx.setLineDash([]);

      // Draw x-axis line
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Draw y-axis line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Only draw the g-force point if x and y are within the max value
      if (Math.abs(gForceData.x) <= gForceData.max && Math.abs(gForceData.y) <= gForceData.max) {
        // Scale g-force data based on max value
        let scaledX = (gForceData.x / gForceData.max) * radius;
        let scaledY = (gForceData.y / gForceData.max) * radius;

        // Calculate the distance from the center to the g-force point
        const distanceFromCenter = Math.sqrt(scaledX * scaledX + scaledY * scaledY);

        // If the point is outside the circle, rescale it to fit within the radius
        if (distanceFromCenter > radius) {
          const scaleFactor = radius / distanceFromCenter;
          scaledX *= scaleFactor;
          scaledY *= scaleFactor;
        }

        // Draw g-force point
        ctx.beginPath();
        const x = centerX + scaledX;
        const y = centerY - scaledY;
        ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#C1FF00';
        ctx.fill();
      }

      // // Scale g-force data based on max value
      // // const scaledX = (gForceData.x / gForceData.max) * radius;
      // // const scaledY = (gForceData.y / gForceData.max) * radius;
      // let scaledX = (gForceData.x / gForceData.max) * radius;
      // let scaledY = (gForceData.y / gForceData.max) * radius;

      // // Calculate the distance from the center to the g-force point
      // const distanceFromCenter = Math.sqrt(scaledX * scaledX + scaledY * scaledY);

      // // If the point is outside the circle, rescale it to fit within the radius
      // if (distanceFromCenter > radius) {
      //   const scaleFactor = radius / distanceFromCenter;
      //   scaledX *= scaleFactor;
      //   scaledY *= scaleFactor;
      // }

      // // Draw g-force point
      // ctx.beginPath();
      // const x = centerX + scaledX;
      // const y = centerY - scaledY;
      // ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
      // ctx.fillStyle = '#C1FF00';
      // ctx.fill();

      // Draw max value text at 4 axes
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px FCSaveSpace';
      ctx.textAlign = 'center';
      // ctx.fillText(gForceData.max, centerX, centerY - radius - 4); // Top
      ctx.fillText(gForceData.max, centerX, centerY + radius + 11); // Bottom
      // ctx.fillText(gForceData.max, centerX - radius - 13, centerY + 5); // Left
      // ctx.fillText(gForceData.max, centerX + radius + 13, centerY + 5); // Right
    };

    drawCircle();
  }, [gForceData]);

  // return <canvas ref={canvasRef} width="100%" height="auto" />;

  return (
    <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
      <canvas ref={canvasRef} width="100%" height="auto" />
      <div className='text-end' style={{
        lineHeight: 1,
        width:"50%",
        position: 'absolute',
        bottom: '9%',
        right: '0',
        backgroundColor: '#C1FF00',
        color: 'black',
        padding: '0px 10px',
        margin: 0,
        zIndex: '-1', // Ensures it is behind the canvas
        fontSize: '0.9rem',
        borderRadius: '0px 7px 0px 0px'
      }}>
        <strong>G-FORCE</strong>
      </div>
    </div>
  );
};

export default GForceMeter;