
import  { Company } from"../models/company.model.js";
export const registerCompany=async (req,res)=>{


    try{
    const {companyName}=req.body;//getting data from the body

    if(!companyName){//checking if the data is missing
        return res.status(400).json({
            message:"company name is required",
            success:false
        })
    }
    let company=await Company.findOne({companyName});//checking if the company already exists

    if(company){//checking if the company already exists
        return res.status(400).json({
            message:"company already exists",
            success:false
        });
    };

    company =await Company.create({//creating the company
        name:companyName,
        success:true
    })

    return res.status(200).json({//sending the response
        message:"company registered successfully",
        success:true,
        company
    })

    return res.status(200).json({
        companies,
        success:true
    })

    }catch (error) {//catching the error
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
   
}

export const getCompany=async(req,res)=>{
    try{

        const userId=req.id;//getting the user id from the token
        const companies=await Company.find({});//getting the company from the database
        if(!companies){
            return res.status(200).json({
                message:"companies not found",
                success:false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })

    }catch(error){
        console.log(error);
    }
}

export const getCompanyById=async(req,res)=>{

    try{

        const companyId=req.params.id;
        const company=await Company.findById(companyId);//getting the company from the database 
        if(!company){
            return res.status(400).json({
                message:"company not found",
                success:false
            })
        }
        return res.status(200).json({
        company,
        success:true
        })

    }catch(error){
        console.log(error);
    }
}

export const updateCompany =async(req,res)=>{
    try{
      const {name,description,location}=req.body;//getting the data from the body
      const file=req.file;

      const updateData={name,description,location};//creating the update data object
      const company=await Company.findByIdAndUpdate(req.params.id,updateData,{new:true});//updating the company

      if(!company){
        return res.status(400).json({
            message:"company not found",
            success:false
        });
      }

      return res.status(201).json({
        message:"company updated successfully",
        success:true,
        company 
      })

    }catch(error){
        console.log(error);
    }
}