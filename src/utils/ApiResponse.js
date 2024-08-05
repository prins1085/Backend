class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode,
        this.error = statusCode > 400,
        this.message = message,
        this.data = data
    }
}

export { ApiResponse }