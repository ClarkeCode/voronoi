console.log("Canvas");

/**
 * @param {number} x 
 * @param {number} y 
 * @returns {Point}
 */
const pt = (x, y) => {return {x: x, y: y}};

/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {Point} start 
 * @param {Point} end 
 * @param {*} colour
 */
const drawLine2 = (context, start, end, colour) => {
	context.beginPath();
	context.moveTo(start.x, start.y);
	context.lineTo(end.x, end.y);
	context.lineWidth = 1;
	context.lineCap = "round";
	context.strokeStyle = colour;
	context.stroke();
}


/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {Point} location 
 * @param {number} length the length of the 'X'
 * @param {*} colour 
 */
const drawCrosshair = (context, location, length, colour) => {
	const hlen = length / 2;

	drawLine2(
		context,
		pt(location.x - hlen, location.y - hlen),
		pt(location.x + hlen, location.y + hlen),
		colour
	);

	drawLine2(
		context,
		pt(location.x - hlen, location.y + hlen),
		pt(location.x + hlen, location.y - hlen),
		colour
	);
}


/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {LinearRegression} model 
 * @param {Dataset} dataset Values in dataset are assumed to be within canvas-space
 * @param {*} colour
 */
function drawLinearRegression(context, model, dataset, colour) {
	if (dataset.length < 2) return;

	let leftMostDatum = dataset[0];
	let rightMostDatum = dataset[0];
	for (const pt of dataset.slice(1)) {
		if (pt.x < leftMostDatum.x) leftMostDatum = pt;
		if (pt.x > rightMostDatum.x) rightMostDatum = pt;
	}

	const modelStart = pt(leftMostDatum.x, model(leftMostDatum.x));
	const modelEnd = pt(rightMostDatum.x, model(rightMostDatum.x));
	drawLine2(context, modelStart, modelEnd, colour);
}

/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {Point} centrePoint The centre of the circle to be drawn
 * @param {number} radius 
 * @param {*} colour 
 */
function drawCircle(context, centrePoint, radius, colour) {
	const circle = new Path2D();
	// const radius = 3;
	circle.arc(centrePoint.x, centrePoint.y, radius, 0, 2 * Math.PI);
	context.fillStyle = colour;
	context.lineWidth = 1;
	context.strokeStyle = "black";
	context.fill(circle);
	context.stroke(circle);
}