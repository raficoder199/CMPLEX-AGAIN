class ApiError extends Error{
    constructor(
        message="Something went wrong",
        statusCode = 500,
        errors = [],
        stack=""
    ){
        super(message),
        this.statusCode =statusCode,
        this.errors = errors,
        this.stack = stack
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructror)
        }
    }
    
}

export{ApiError}