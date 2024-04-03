console.log("Stats time");

/**
 * @typedef {{x: number, y: number}} Point
 */

/**
 * @typedef {{x:number, y:number}[]} Dataset
 */

/**
 * @typedef {(x:number)=>number} LinearRegression
 */


/**
 * Provides the mean of the dataset
 * @param {Dataset} dataset 
 * @returns {Point} The point at the average of the dataset
 */
const getCentroid = (dataset) => {
	const sumPoint = dataset.reduce((prev, current) => {
		return {
			x: prev.x + current.x,
			y: prev.y + current.y
		}}
	);
	return {x: sumPoint.x / dataset.length, y: sumPoint.y / dataset.length};
}






/**
 * Produces a linear regression model based on the provided dataset
 * @param {Dataset} dataset 
 * @returns {LinearRegression} a function which produces a Y-value for a given X, based on the provided dataset
 * @todo TODO: currently does not account for entirely vertical datasets
 * @link See https://towardsdatascience.com/linear-regression-from-scratch-cd0dee067f72
 */
function linearRegression(dataset) {
	if (dataset.length <= 1) {
		return (x) => 0;
	}

	const xMean = dataset.map(e => e.x).reduce((prev, current)=>prev+current) / dataset.length;
	const yMean = dataset.map(e => e.y).reduce((prev, current)=>prev+current) / dataset.length;

	let numerator = 0;
	let denominator  = 0;
	for (const pt of dataset) {
		numerator += (pt.x - xMean) * (pt.y - yMean);
		denominator  += Math.pow(pt.x - xMean, 2);
	}

	const beta1 = numerator / denominator; //AKA - 'm'
	const beta0 = yMean - (beta1 * xMean); //AKA - 'b'

	const linearModel = (x) => { return beta0 + beta1 * x; }
	return linearModel;
}

/**
 * Root Mean Squared Error
 * @param {Dataset} dataset 
 * @param {LinearRegression} model 
 * @returns {number} The average error present in the model; Values closer to 0 are better
 * @link See https://towardsdatascience.com/linear-regression-from-scratch-cd0dee067f72
 */
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

/**
 * R² Score (AKA Coefficient of Determination)
 * @param {Dataset} dataset 
 * @param {LinearRegression} model 
 * @returns {number} A number between 0 and 1; Values closer to 1 indicate a more accurate model
 * @link See https://towardsdatascience.com/linear-regression-from-scratch-cd0dee067f72
 */
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

/**
 * Produce a LinearRegression for a given dataset, along with the RMSE and R² Score
 * @param {Dataset} dataset 
 * @returns 
 * @link See https://towardsdatascience.com/linear-regression-from-scratch-cd0dee067f72
 */
const batchLinearRegression = (dataset) => {
	const model = linearRegression(dataset);
	return {
		regression: model,
		rmse: rootMeanSquaredError(dataset, model),
		r2score: determinationCoefficient(dataset, model)
	}
}