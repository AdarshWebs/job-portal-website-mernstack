



export const postJob = async (req, res) => {

    try{
      const {title, description,requirements,salary,location,jobType,experience,position,companyId} = req.body;

        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({message:"Please fill all the fields"});
        } 

        const job=await job.create({
            title,
            description,
            requirements:requirements.split(','),
            salary:Number(salary),
            location,
            jobType,
            experienceLevel:experience,
            position,
            companyId       

        })


    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}