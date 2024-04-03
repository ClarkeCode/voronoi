const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

let canvas = document.getElementById("mapCanvas");
let context = canvas.getContext("2d");

context.imageSmoothingEnabled = false;

const rmseScoreLabel = document.getElementById("rmseScore");
const r2ScoreLabel = document.getElementById("r2Score");

let points = [makePoint(175, 400), makePoint(400, 215)];

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

function clearCanvas() {
	context.fillStyle = "rgb(255 255 255)";
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillRect(0, 0, canvas.width, canvas.height);
	rmseScoreLabel.innerText = 0;
	r2ScoreLabel.innerText = 0;
}

const squaredEuclideanDistance = (x1, y1, x2, y2) => {
	return (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1);
}
const distanceFunc = squaredEuclideanDistance;

function drawLine(x1, y1, x2, y2) {
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.closePath();
	context.stroke();
}

//TODO: currently cannot figure out entirely vertical datasets
//https://towardsdatascience.com/linear-regression-from-scratch-cd0dee067f72
function linearRegression(dataset) {

	if (dataset.length <= 1) {
		return (x) => 0;
	}
	console.log("Regression");
	const xMean = dataset.map(e => e.x).reduce((prev, current)=>prev+current) / dataset.length;
	const yMean = dataset.map(e => e.y).reduce((prev, current)=>prev+current) / dataset.length;
	
	console.log(xMean);
	
	let numerator = 0;
	let denominator  = 0;
	for (const pt of dataset) {
		numerator += (pt.x - xMean) * (pt.y - yMean);
		denominator  += Math.pow(pt.x - xMean, 2);
	}

	const beta1 = numerator / denominator; //AKA - 'm'
	const beta0 = yMean - (beta1 * xMean); //AKA - 'b'

	console.log(beta1, beta0);
	const linearModel = (x) => { return beta0 + beta1 * x; }


	context.lineWidth = 1;
	context.lineCap = "round";
	context.strokeStyle = "green";
	drawLine(
		0, linearModel(0),
		CANVAS_WIDTH, linearModel(CANVAS_WIDTH)
	);

	return linearModel;
}

//TODO
function rootMeanSquaredError(dataset, model) {
	let rmse = 0;
	for (const pt of dataset) {
		const prediction = model(pt.x);
		const actual = pt.y;
		rmse += Math.pow(actual - prediction, 2);
	}
	rmse = Math.sqrt(rmse / dataset.length)
	return rmse;
}
function determinationCoefficient(dataset, model) {
	let r2score = 0;

	let sumOfResiduals = 0;
	let sumOfSquares = 0;

	const yMean = dataset.map(e => e.y).reduce((prev, current)=>prev+current) / dataset.length;
	for (const pt of dataset) {
		const prediction = model(pt.x);
		const actual = pt.y;
		sumOfResiduals += Math.pow(actual - prediction, 2);
		sumOfSquares += Math.pow(actual - yMean, 2);
	}

	r2score = 1 - (sumOfResiduals / sumOfSquares);
	return r2score;
}

function drawPoints() {
	console.log("Points:", points);
	for (const pt of points) {
		pt.drawFunc();
	}
}

function drawToScreen() {
	clearCanvas();
	const model = linearRegression(points);
	rmseScoreLabel.innerText = rootMeanSquaredError(points, model).toFixed(2);
	r2ScoreLabel.innerText = determinationCoefficient(points, model).toFixed(3);
	drawPoints();
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


console.log("Bounding Rect", canvas.getBoundingClientRect())
drawToScreen();