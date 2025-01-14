export const errorHandler = (err, req, res, next) => {
	const responseObject = {
		error: err.message
	};
	if (process.env.NODE_ENV === "development") {
		responseObject.stack = err.stack;
	}
	const code = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(code).json(responseObject);
};