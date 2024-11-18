import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/calpal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Define the User schema

const UserSchema = new mongoose.Schema({
    username: {type: String,required: true},
    passwordHash: {type: String,required: true},
    email: {type: String,required: true},
    age: {type: Number,required: true},
    phoneNumber: {type: String,required: true},
    plantLevel: {type: Number,required: true},
    friendsList: {type: Array,required: true},
    tasks: {type: Array,required: true},
    name: {type: String,required: true}
});

// Create a User model
const User = mongoose.model('User', UserSchema);

// Define the functions that will be called when the routes are hit

// Get all users
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

// Get a user based on username
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const createUser = async (req, res, next) => {
    try {
        const newUser = new User({
            username:req.body.username,
            passwordHash:req.body.password,
            email:req.body.email,
            age:req.body.age,
            phoneNumber:req.body.phoneNumber,
            name:req.body.name,
            plantLevel:0,
            friendsList:[],   
            tasks:[]
        })
        const user = await User.findOne({ username: req.body.username })
        if(!user){
            await newUser.save()
        }  else {
            res.json('User already exists')
        }
    } catch (error) {
        next(error)
    }
}

// Update a user based on username
export const createTask = async (req, res, next) => {
    try {
        const user = await User.findOne({username:req.params.username})
        if (!user) {
            res.status(404).json({message: 'User not found'})
            return
        }
        const newTask = {
            title:req.body.title,
            time:req.body.time,
            date:req.body.date,
            content:req.body.content
        }
        if(!(req.body.title)){
            res.status(400).json({message: 'Enter proper task details'})
            return
        }
        user.tasks.push(newTask)
        await user.save()
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}

// Delete a task from a user based on username and task id

export const deleteTask = async (req, res, next) => {
    try {
        const user = await User.findOne({username:req.params.username})
        if (!user) {
            res.status(404).json({message:'User not found'})
            return
        }
        console.log(req.params.title)
        user.tasks = user.tasks.filter((task)=> task.title != decodeURIComponent(req.params.title))
        await user.save()
        res.status(200).json("task deleted")
    } catch (error) {
        next(error)
    }
}

export const addFriend = async (req, res, next) => {
    try {
        const user = await User.findOne({username:req.params.username})
        if (!user) {
            res.status(404).json({message:'User not found'})
            return
        }
        const friend = await User.findOne({username:req.params.friend})
        if (!friend) {
            res.status(404).json({message:'Friend not found'})
            return
        }
        user.friendsList.push(friend.username)
        await user.save()
        res.status(200).json('friend added')
    } catch (error) {
        next(error)
    }
}


export const deleteFriend = async (req, res, next) => {
    try {
        const user = await User.findOne({username:req.params.username})
        if (!user) {
            res.status(404).json({message:'User not found'})
            return
        }
        user.friendsList = user.friendsList.filter((friend)=> friend != req.params.friend)
        await user.save()
        res.status(200).json("friend deleted")
    } catch (error) {
        next(error)
    }
}
