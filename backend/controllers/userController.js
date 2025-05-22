
import User from "../model/UserModel.js";



export const addUser = async (req, res) => {
    try{

        let exist = await User.findOne({sub: req.body.sub});
        if(exist){
            return res.status(200).json({message: "User already exists!"});
            
        }

        const newUser = new User(req.body);
        await newUser.save();

        return res.status(200).json({message: "User added successfully!"});

    } catch(error){
        
        res.status(500).json({message: error.message});
    }

}

export const getUsers = async (req, res) => {
    try{
        
        const users = await User.find({});
    
         
        return res.status(200).json(users);

    } catch(error){
        res.status(500).json({message: error.message});
    }
}
