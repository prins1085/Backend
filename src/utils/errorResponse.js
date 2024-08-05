const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const response = {
        statusCode: statusCode,
        error: true,
        message: err.message || 'Internal Server Error',
    };

    res.status(statusCode).json(response);
};

export default errorMiddleware;