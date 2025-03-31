import jwt from 'jsonwebtoken';
import crypto from 'crypto';
export const generateToken= (userId,res)=>
{
    const sessionToken=crypto.randomUUID();
    const token=jwt.sign({userId,sessionToken},process.env.jwt_secret,{
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
    res.cookie('sessionId',sessionToken,{
    
        maxAge:24*60*60*1000,
        httpOnly:true,
        secure:process.env.node_env!=='production'?true:false,
        sameSite:'strict',
        });
   
}