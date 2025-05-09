import cloudinary from "../lib/cloudinary.js";
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
        const hashedPassword=await bcrypt.hash(password,10); //salt 10 for more security
        const newUser=new User({
            fullName,
            email,
            password:hashedPassword,
        });
        if (newUser) {
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
                createdAt:newUser.createdAt
        });
        }
        else {
            return res.status(400).json({message:"Failed to create user"});
    }
}

    catch (error) {
        console.log("error in signup",error);
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
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
            createdAt:user.createdAt,
        
    })
        
    
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Log out successful"});
        res
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}


export const updateProfile = async(req,res) =>{
    try {
        const {profilePic}=req.body;
        const userId=req.user._id;
    if (!profilePic) {
        return res.status(400).json({message:"Profile pic is required"});
    }
    
    
    const uploadResponse =await cloudinary.uploader.upload(profilePic);
    const updatedUser=await User.findByIdAndUpdate(userId,
        {profilePic:uploadResponse.secure_url},
        {new:true}
    );
    res.status(200).json(updatedUser);
}
    catch (error) {

        console.log(error.message);
        res.status(500).json({message:"Internal server error"});
    }
}
export const addContact = async (req, res) => {
    try {
        const { email } = req.body; 
        const userId = req.user._id;

        // find the user with the email
        const contactUser = await User.findOne({ email });
        if (!contactUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // restricting self add
        if (contactUser._id.equals(userId)) {
            return res.status(400).json({ message: "You cannot add yourself as a contact" });
        }

        //already in my contact list
        const user = await User.findById(userId);
        if (user.contacts.includes(contactUser._id)) {
            return res.status(400).json({ message: "User is already in your contacts" });
        }

        //adding to my contact list
        user.contacts.push(contactUser._id);
        await user.save();

        res.status(200).json({ message: "Contact added successfully", contact: contactUser._id });
    } catch (error) {
        console.error("Error adding contact:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req,res) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

