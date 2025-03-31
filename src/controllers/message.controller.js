import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getContactListForSidebar = async (req, res) => {
    try {
        const myUserId = req.user._id;
        if (!myUserId) {
            return res.status(400).json({ message: "User not found" });}
        const myContacts=await User.findById(myUserId).select('contacts');
        if (!myContacts) {
            return res.status(400).json({ message: "No contacts found" });
        }
        const myContactIds = await User.find({ _id: { $in: myContacts.contacts } }).select('-password');
        
        res.status(200).json(myContactIds);
    } catch (error) {
        console.log("errornin getUserListForSidebar",error.message);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getMessages = async (req, res) => {
    try {
       const {receiverId:mychatId}=req.params;
       const myId=req.user._id;
       const messages=await Message.find({
        $or:
        [{senderId:myId,receiverId:mychatId},
        {senderId:mychatId,receiverId:myId}]
    });
    res.status(200).json(messages);

    } catch (error) {

        console.log("errornin getMessages",error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text,image} = req.body;
        const {receiverId:receiverId}=req.params;
        const senderId=req.user._id;

        let imageUrl;
        if (image){
            const uploadImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadImage.secure_url;
        }

        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("sentMessage", newMessage);
        }
        res.status(200).json(newMessage);


         
        
        
    } catch (error) {
        console.log("errorin sendMessage",error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}