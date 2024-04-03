const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;


let canvas = document.getElementById("mapCanvas");
/**
 * @type {CanvasRenderingContext2D}
 */
let context = canvas.getContext("2d");

context.imageSmoothingEnabled = false;

const rmseScoreLabel = document.getElementById("rmseScore");
const r2ScoreLabel = document.getElementById("r2Score");
const clusterButton = document.getElementById("clusterButton");


let points = [makePoint(175, 400), makePoint(400, 215)];



/**
 * @param {number} x 
 * @param {number} y 
 * @returns 
 */
function makePoint(x, y) {
	return {
		x: x,
		y: y,
		drawFunc: () => {
			drawCircle(context, pt(x,y), 3, "#777777");
		},
		colour: //randomColour()
		{
			r: Math.max(Math.round(Math.random() * 255, 0), 30),
			g: Math.max(Math.round(Math.random() * 255, 0), 30),
			b: Math.max(Math.round(Math.random() * 255, 0), 30),
		}// `rgb(${Math.max(Math.random(), 0.3) * 255} ${Math.max(Math.random(), 0.3) * 255} ${Math.max(Math.random(), 0.3) * 255})`
	};
}

function clearCanvas() {
	context.fillStyle = "rgb(255 255 255)";
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillRect(0, 0, canvas.width, canvas.height);
	rmseScoreLabel.innerText = 0;
	r2ScoreLabel.innerText = 0;
}

/**
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @returns 
 */
const squaredEuclideanDistance = (x1, y1, x2, y2) => {
	return (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1);
}
const distanceFunc = squaredEuclideanDistance;




function drawPoints() {
	console.log("Points:", points);
	for (const pt of points) {
		pt.drawFunc();
	}
}





function drawToScreen() {
	clearCanvas();

	const {regression, rmse, r2score} = batchLinearRegression(points);
	drawLinearRegression(context, regression, points, "green");
	rmseScoreLabel.innerText = rmse.toFixed(2);
	r2ScoreLabel.innerText = r2score.toFixed(3);

	drawPoints();
	drawCrosshair(context, getCentroid(points), 10, "red");
}


canvas.addEventListener("click", (e) => {
	const bdrect = canvas.getBoundingClientRect();
	const canvasSpaceX = e.clientX - bdrect.left;
	const canvasSpaceY = e.clientY - bdrect.top;
	console.log("Click", canvasSpaceX, canvasSpaceY);
	points.push(makePoint(canvasSpaceX, canvasSpaceY));

	drawToScreen();
});

document.getElementById("clearButton").addEventListener("click", (e) => {
	points = [];
	clearCanvas();
});

const datasets = {
	triangleSquare: [
		makePoint(100,300),
		makePoint(200,300),
		makePoint(150,200),
		makePoint(600,400),
		makePoint(700,400),
		makePoint(600,300),
		makePoint(700,300),
		makePoint(650,350)
	],
	triangle: [
		makePoint(100,300),
		makePoint(200,300),
		makePoint(150,200)
	],
	onePoint: [makePoint(300,400)],
	square: [
		makePoint(600,400),
		makePoint(700,400),
		makePoint(600,300),
		makePoint(700,300),
		makePoint(650,350)
	]
}


const dropdown = document.getElementById("selector");

for (const key in datasets) {
	dropdown.innerHTML += `<option value="${key}">${key.toUpperCase()}</option>`;
}
points = [];
for (const ele of datasets[Object.keys(datasets)[0]]) {
	points.push(ele);
}

dropdown.addEventListener("change", (event) => {
	console.log(event.target.value);
	points = [];
	clearCanvas();

	for (const ele of datasets[event.target.value]) {
		points.push(ele);
	}
	drawToScreen();
});

/**
 * @param {Dataset} dataset 
 * @param {number} numClusters 
 * @param {number} iterations 
 * @link See https://neptune.ai/blog/k-means-clustering
 */
function kmeansClustering(dataset, numClusters, iterations) {
}

console.log("Bounding Rect", canvas.getBoundingClientRect())
drawToScreen();


const myRect = new Path2D();
myRect.rect(50, 450, 75, 25);
context.lineWidth = 1;
context.strokeStyle = "rgb(0 0 0)";
context.fillStyle = "rgb(0 0 255)";
context.fill(myRect);
context.stroke(myRect);





drawCrosshair(context, getCentroid(points), 10, "red");

drawLine2(context, {x:50,y:50}, {x:100,y:100}, "green");

drawCircle(context, pt(100,100), 5, "purple");
drawCrosshair(context, pt(100,100), 10, "orange");