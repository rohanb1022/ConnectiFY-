import User from "../models/user.model.js"
import Message from "../models/message.model.js"

export const getUserForSidebar = async (req, res) => {
    try{
    const loggedInUser = req.user._id;
    const filteredUser = await User.find({ _id : { $ne : loggedInUser }}).select("-password");
    res.status(200).json({message : "filteredUser"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Some Internal Server Error"});
    }
}

export const getmessage = async (req, res) => {
    try {
        const {id: userIdtoChat} = req.params;
        const myId = req.user._id;

        // this is basically to fetch messages from the both users 
        // to understand it in more detail  $or is the function that will select any one from the given array any one condition from the array can be true either sender will be me that is senderId = myId and receiverId will be her id so first element of the array will be true or second which vice versa condition

        const messages = await Message.find({
            $or : [
                {senderId : myId , receiverId : userIdtoChat},
                {senderId : userIdtoChat , receiverId : myId}
            ]
        });
        res.status(200).json(messages)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal Server error"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text , image } = req.body;
        const {receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl
        if(image){
            const uploadImage = await cloudinary.uploader.upload(image);
            imageUrl : uploadImage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image : imageUrl,
        });

        await newMessage.save();

        res.status(200).json({message : "The message is sent successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"})
    }
}