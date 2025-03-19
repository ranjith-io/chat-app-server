import jwt from 'jsonwebtoken';

export const generateToken= (userId,res)=>
{
    const token=jwt.sign({userId},process.env.jwt_secret,{
        expiresIn:'1d',


    })
   res.cookie('jwt',token,{
    maxAge:24*60*60*1000,
    httpOnly:true,
    secure:process.env.node_env!=='production'?true:false,
    sameSite:'strict',
    
   });
   return token;
}