class ApiResponse {
    constructor(statusCode,data,messege="success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = messege;
        this.success = statusCode < 400;
    }
}

export {ApiResponse}