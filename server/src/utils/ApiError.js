class ApiError extends Error{

    constructor(
        statusCode,
        message="There is some problem !!",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        this.data = null // aa jova nu che 
        this.success = false

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}
export {ApiError}