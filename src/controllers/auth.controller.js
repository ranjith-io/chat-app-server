import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async(req, res) => { 
    const {fullName,email,password}=req.body;

    try{
        //hash password
        if (!fullName || !email || !password) {
            return res.status(400).json({message:"All fields are required"});
        }

        if (password.length < 8) {
            return res.status(400).json({message:"Password must be at least 8 characters long"});
        }
        //If user already exists
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        
        
        //create new User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            fullName,
            email,
            password:hashedPassword,
        });
        if (newUser) {
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({message:"User created successfully"});
        }
        else {
            return res.status(400).json({message:"Failed to create user"});
    }
}

    catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"Internal server error"});

    }
}

export const login = async(req, res) => {
    const {email,password}=req.body;
    try {
        const user=await User.findOne({email});
        if (!user) {
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isPass = await bcrypt.compare(password,user.password)
        if (!isPass) {
            return res.status(400).json({message:"Invalid credentials"});
        }
        generateToken(user._id,res);
        res.status(200).json({message:"Login successful"});
    
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Log out successful"});
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const userdata = async(req,res) =>{
    try {
    const userss = await User.find({});
    res.json(userss);
    }
    catch (error){
        console.log(error.message);
    }
}