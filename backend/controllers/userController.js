import User from "../model/UserModel.js";

export const addUser = async (req, res) => {
    try {
        const { sub, name, picture, email } = req.body;

        // Validation
        if (!sub || !name || !picture) {
            return res.status(400).json({ 
                message: "sub, name, and picture are required" 
            });
        }

        let exist = await User.findOne({ sub });

        if (exist) {
            // Update user if needed
            if (exist.name !== name || exist.picture !== picture) {
                exist.name = name;
                exist.picture = picture;
                if (email) exist.email = email;
                await exist.save();
                return res.status(200).json({ 
                    message: "User updated successfully!",
                    user: exist 
                });
            }
            return res.status(200).json({ 
                message: "User already exists!",
                user: exist 
            });
        }

        const newUser = new User(req.body);
        await newUser.save();

        return res.status(201).json({ 
            message: "User added successfully!",
            user: newUser 
        });

    } catch (error) {
        console.error("Error in addUser:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-__v'); // Exclude version field
        
        return res.status(200).json(users);

    } catch (error) {
        console.error("Error in getUsers:", error);
        res.status(500).json({ message: error.message });
    }
};