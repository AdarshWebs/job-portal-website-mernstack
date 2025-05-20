import jwt from "jsonwebtoken";

// making a authencticated function
const isAuthenticated=async(req,res,next)=>{

    try{
       const token=req.cookies.token;// getting the token from the cookie

       if (!token){// if token is not getted the use is not authenticated
        return res.status(401).json({
            message:"user is not authenticated",
            success:false
        });
       };

       const decode=await jwt.verify(token,process.env.JWT_SECRET);// decodeing the toekn 
       

       if(!decode){
        return res.status(401).json({
            message:"invalid token",
            success:false
        });
       };

    
       req.id=decode.userId;
       next();
    }
    catch(error){
        console.log(error)
    }

}
export default  isAuthenticated;
