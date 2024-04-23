 export const create_msg_formate = (para1) => {
    try {   
        let para = JSON.parse(para1)
        let success=true
        let message="Created Successful"
        if(para.count==0){
            success=false
            message="Unable to create"
        }
      	return {success:success, message:message}
      
       }catch(error){
         return false
       }
  };
  export const update_msg_formate = (para1) => {
    try {   
        let para = JSON.parse(para1)
        let success=true
        let message="Update Successful"
        if(para.count==0){
            success=false
            message="Unable to create"
        }
      	return {success:success, message:message}
      
       }catch(error){
         return false
       }
  };
  export const list_common =(req) => {
    return {
    ...(req.query.skip ? { skip: parseInt(req.query.skip) } : {}),
    ...(req.query.take ? { take: parseInt(req.query.take) } : {}),
    orderBy: {  
      id: 'desc',  
    },}
  }