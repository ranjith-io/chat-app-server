import jwt from 'jsonwebtoken';
// console.log(token);
// console.log(process.env.node_env);
export const generateToken= (userId,res)=>
{
    const token=jwt.sign({userId},process.env.jwt_secret,{
        expiresIn:'1d',


    })
    // console.log(token);
    // console.log(process.env.jwt_secret);
   res.cookie('jwt',token,{
    
    maxAge:24*60*60*1000,
    httpOnly:true,
    secure:process.env.node_env!=='production'?true:false,
    sameSite:'strict',
    });
   return token;
}