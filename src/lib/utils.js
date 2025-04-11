import jwt from 'jsonwebtoken';
import crypto from 'crypto';
export const generateToken= (userId,res)=>
{
    const sessionToken=crypto.randomUUID();
    const token=jwt.sign({userId,sessionToken},process.env.jwt_secret,{
        expiresIn:'1d',


    })
    console.log("sessionToken",sessionToken);
    
   
   res.cookie('jwt',token,{
    
    maxAge:24*60*60*1000,
    httpOnly:true,
    secure:true,
    sameSite:'none',
    });
    res.cookie('sessionId',sessionToken,{
    
        maxAge:24*60*60*1000,
        httpOnly:true,
        secure:true,
        sameSite:'none',
        });
   
}