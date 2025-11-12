const asyncHandler=(fun)=>async (req,res,next)=>{
    try{
        return await fun(req,res,next);
    }catch(error){
        next(error); 
    }
}

export default asyncHandler;