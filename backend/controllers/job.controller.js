import {Job} from '../models/job.model.js';
import { Company } from '../models/company.model.js';

export const postJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;

    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const userId=req.id;
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(','),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company:companyId,
      created_by:userId
    });
    return res.status(201).json({ message: "Job posted successfully", job });

   

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAlljobs = async(req,res)=>{
    try{
        const keyword=req.query.keyword || "";
        const query={
            $or:[
                {title:{$regex:keyword,$options:'i'}},
                {description:{$regex:keyword,$options:'i'}},

            ]
        };

        const jobs=await Job.find(query).populate({
          path:"company"
        
        }).sort({createdAt:-1});
        if(!jobs){
            return res.status(400).json({
                message:"job not found",
                success:false
            })
        };
        return res.status(200).json({
            message:"job fetched successfully",
            success:true,
            jobs
        })
      

    }catch(error){
        console.log(error);
    }
};

export const getJobById=async(req,res)=>{
  try{
    const jobId=req.params.id;
    const job =await Job.findById(jobId);
    if(!job){
      return res.status(404).json({
        message:"job not found",
        success:false
      })
    };

    return res.status(200).json({
      job,
      success:true
    })

  }catch(error){
    console.log(error)
  }
}

export const getAdminJobs=async(req,res)=>{
  try{
    const adminId=req.id
    const jobs = await Job.find({ });

    if(!jobs){
      return res.status(404).json({
        message:'jobs are not found',
        success:false
      })
    }
    return  res.status(200).json({
      jobs,
      message:'job found successfulyy',
      success:true
    })

  }catch(error){
    console.log(error)
  }
}