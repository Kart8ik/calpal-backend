import mongoose from 'mongoose';
import { Group } from './groupController.js'
import dotenv from 'dotenv'
const envConfigResult = dotenv.config()

// Connect to MongoDB
try {
    await mongoose.connect(process.env.MONGODB_URI, {
    });
    console.log('Connected to MongoDB');
} catch (err) {
    console.error('Failed to connect to MongoDB', err);
}

// Define the Invitee schema
const InviteeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    groupName: { type: String, required: true },
    selected: { type: Boolean, required: true }
  }, { _id: false }); // don't generate extra _ids for these

// Define the User schema
const UserSchema = new mongoose.Schema({
    userId: {type:String,required: true},
    username: {type: String,required: true},
    age: {type: Number,required: true},
    phoneNumber: {type: String,required: true},
    plantLevel: {type: Number,required: true},
    friendsList: {type: Array,required: true},
    tasks: {type: Array,required: true},
    name: {type: String,required: true},
    groups: {type: Array,required: true},
    groupInvites: {type: Array,required: true},
    userInvites: {
        type: Map,
        of: [InviteeSchema],
        default: {},
        required: true
      }
});
  
  
// Create a User model
export const User = mongoose.model('User', UserSchema);

// Define the functions that will be called when the routes are hit

// Get all users
export const getUsers = async (req, res, next) => {
    try {
        if(req.query.type === 'detailed'){
            const users = await User.find();
            res.status(200).json(users);
        } else if(req.query.type === 'basic'){
            const users = await User.find({},'userId username');
            res.status(200).json(users);
        } else if(req.query.type === 'group'){
            const users = await User.find();
            res.status(200).json(users);
        }
    } catch (error) {
        next(error);
    }
}

export const getUsersTaskInfo = async (req, res, next) => {
    try {
        const users = await User.find({userId:{$in:req.body.members}},'userId username tasks');
        const refinedUsers = users.map(user => {
            user.tasks = user.tasks.map(task => {
                return {
                    time: task.time,
                    date: task.date
                }
            })
            return user;
        })
        res.status(200).json(refinedUsers);
    } catch (error) {
        next(error);
    }
}
// Get a user based on username
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        res.status(200).json(user);
    } catch (error) {   
        next(error);
    }
}

// Create a new user
export const createUser = async (req, res, next) => {
    try {
        const newUser = new User({
            userId:req.body.userId,
            username:req.body.username,
            age:req.body.age,
            phoneNumber:req.body.phoneNumber,
            name:req.body.name,
            plantLevel:0,
            friendsList:[],   
            tasks:[],
            groups:[],
            groupInvites:[],
            userInvites:{}
        })
        console.log('newUser object before save:', newUser);
        const user = await User.findOne({ userId: req.body.userId })
        if(!user){
            await newUser.save()
            res.status(200).json('User saved')
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
        const user = await User.findOne({userId:req.params.userId})
        if (!user) {
            res.status(404).json({message: 'User not found'})
            return
        }
        const newTask = {
            title:req.body.title,
            time:req.body.time,
            date:req.body.date,
            content:req.body.content,
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

// Delete a task from a user based on username and task title
export const deleteTask = async (req, res, next) => {
    try {
        const user = await User.findOne({userId:req.params.userId})
        if (!user) {
            res.status(404).json({message:'User not found'})
            return
        }
        console.log(req.body.title)
        user.tasks = user.tasks.filter((task)=> task.title !== req.body.title)
        await user.save()
        res.status(200).json({"task deleted":req.body.title})
    } catch (error) {
        next(error)
    }
}

export const requestGroup = async (req, res, next) => {
    try {
        const ownerId = req.body.owner; // UserID of the group owner who manages the invites
        const groupId = req.body.groupId; // ID of the group the request is for
        const inviteeUserId = req.body.userId; // UserID of the person requesting to join
        const inviteeUsername = req.body.username; // Username of the person requesting to join
        const groupName = req.body.groupName; // Name of the group

        // Basic validation for incoming data
        if (!ownerId || !groupId || !inviteeUserId || !inviteeUsername || !groupName) {
            return res.status(400).json({ message: 'Missing required fields for group request (owner, groupId, userId, username, groupName).' });
        }

        const groupOwner = await User.findOne({ userId: ownerId });
        if (!groupOwner) {
            return res.status(404).json({ message: 'User (Owner) not found' });
        }

        const newInvitee = { userId: inviteeUserId, username: inviteeUsername, groupName: groupName, selected: false };

        let inviteesForGroup = groupOwner.userInvites.get(groupId);

        if (!inviteesForGroup) {
            // If this groupId is not yet a key in userInvites, create a new array with the newInvitee
            groupOwner.userInvites.set(groupId, [newInvitee]);
        } else {
            // If groupId exists, add the newInvitee to the existing list
            // Check if the newInvitee is already in the list
            if (!inviteesForGroup.some(invitee => invitee.userId === newInvitee.userId)) {
                inviteesForGroup.push(newInvitee);
            }
            // Re-set the array in the map to ensure Mongoose detects the change.
            groupOwner.userInvites.set(groupId, inviteesForGroup);
        }

        await groupOwner.save();
        // Return the updated owner document, consistent with original behavior
        res.status(200).json(groupOwner);
    } catch (error) {
        console.error("Error in requestGroup:", error);
        next(error);
    }
};

// Add a friend to a user based on username
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

// Delete a friend from a user based on username
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
