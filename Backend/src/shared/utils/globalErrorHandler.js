/**
 * Global Error Handler
 *
 * @param {Error} err - The error object
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @param {Function} next - The next middleware function
 */



export function globalErrorHandler(err, req, res, next) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    console.error('Error:',{
        message: message,
        stack: err.stack,
        statusCode
    })
}
