const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

let canvas = document.getElementById("mapCanvas");
let context = canvas.getContext("2d");

context.imageSmoothingEnabled = false;

let points = [makePoint(250, 100)];

function makePoint(x, y) {
	return {
		x: x,
		y: y,
		drawFunc: () => {
			const circle = new Path2D();
			const radius = 3;
			circle.arc(x, y + radius/2, radius, 0, 2 * Math.PI);
			context.fillStyle = "#777777";
			context.lineWidth = 1;
			context.strokeStyle = "#000000";
			context.fill(circle);
			context.stroke(circle);
		},
		colour: //randomColour()
		{
			r: Math.max(Math.round(Math.random() * 255, 0), 30),
			g: Math.max(Math.round(Math.random() * 255, 0), 30),
			b: Math.max(Math.round(Math.random() * 255, 0), 30),
		}// `rgb(${Math.max(Math.random(), 0.3) * 255} ${Math.max(Math.random(), 0.3) * 255} ${Math.max(Math.random(), 0.3) * 255})`
	};
}

function clear() {
	context.fillStyle = "rgb(255 255 255)";
	context.fillRect(0, 0, canvas.width, canvas.height);
}
clear();

const squaredEuclideanDistance = (x1, y1, x2, y2) => {
	return (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1);
}
const distanceFunc = squaredEuclideanDistance;

function colourVoronoiCells() {
	const imd = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
	const data = imd.data;
	for (let y = 0; y < CANVAS_WIDTH; y++) {
		for (let x = 0; x < CANVAS_WIDTH; x++) {
			const basePixelOffset = 4 * (CANVAS_WIDTH * y + x);

			let closestDistance = Number.MAX_VALUE;
			let closestColour = {r: 0, g: 0, b: 0};

			for (const pt of points) {
				const dist = distanceFunc(x, y, pt.x, pt.y)
				if (dist < closestDistance) {
					closestDistance = dist;
					closestColour = pt.colour;
				}
			}

			data[basePixelOffset + 0] = closestColour.r;
			data[basePixelOffset + 1] = closestColour.g;
			data[basePixelOffset + 2] = closestColour.b;
			data[basePixelOffset + 3] = 255;
			//console.log("Pixel", data[basePixelOffset + 0],data[basePixelOffset + 1],data[basePixelOffset + 2],data[basePixelOffset + 3]);
			// console.log("Closest colour", closestColour);
		}
	}
	context.putImageData(imd, 0, 0);
}

function drawPoints() {
	console.log("Points:", points);
	for (const pt of points) {
		pt.drawFunc();
	}
}

canvas.addEventListener("click", (e) => {
	const bdrect = canvas.getBoundingClientRect();
	const canvasSpaceX = e.clientX - bdrect.left;
	const canvasSpaceY = e.clientY - bdrect.top;
	console.log("Click", canvasSpaceX, canvasSpaceY);
	points.push(makePoint(canvasSpaceX, canvasSpaceY));
	clear();
	colourVoronoiCells();
	drawPoints();
});


console.log("Bounding Rect", canvas.getBoundingClientRect())
drawPoints();