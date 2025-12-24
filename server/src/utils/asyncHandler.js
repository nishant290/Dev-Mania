// this is a higher order function, which takes the function as argument and return the promise of that args function with calling it for resolve.

const asyncHandler = (requestHandler) =>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch(err=>next(err))
    }
} 

export {asyncHandler}   