import mongoose from 'mongoose';
import { User } from './userController.js'
import dotenv from 'dotenv'
const envConfigResult = dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Define the Group schema

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: { type: Array, required: true },
    tasks: { type: Array, required: true },
    owner: { type: String, required: true },
    type: { type: String, required: true },
});


// Create a Group model
export const Group = mongoose.model('Group', GroupSchema);

// functions to deal with all endpoints related to groups

// Get all groups based on query
export const getGroups = async (req, res, next) => {
    try {
        let groups;
        if(req.query.type === 'invite'){
            groups = await Group.find({ type: 'invite', members: { $nin: [req.query.userId] } },'_id name description type owner');
        } else if(req.query.type === 'user'){
            groups = await Group.find({ members: { $in: [req.query.userId] } },'_id name description type owner');
        } 
        if(!groups){
            res.status(404).json({message:'Group not found'})
        }
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
}

// Get a group based on groupId (detailed)
export const getGroup = async (req, res, next) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if(!group){
            res.status(404).json({message:'Group not found'})
        }
        res.status(200).json(group);
    } catch (error) {
        next(error);
    }
}

// Create a new group   
export const createGroup = async (req, res, next) => {
    try {
        const newGroup = new Group({
            name: req.body.name,
            description: req.body.description,
            members: [req.body.owner],
            tasks: [],
            type: req.body.type,
            owner: req.body.owner,
        });
        //all members except owner are invited to the group
        const users = await User.find({$and:[{userId: {$in: req.body.members}},{userId: {$ne: req.body.owner}}]})
        for(const user of users){
            user.groupInvites.push({groupId: newGroup._id, groupName: newGroup.name,owner: newGroup.owner, selected: false})
            await user.save()
        }
        if (!(req.body.name)) {
            res.status(400).json({ message: 'Enter proper group details' })
            return
        }
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        next(error);
    }
}

// delete a group based on groupId

export const deleteGroup = async (req, res, next) => {
    try {
        const group = await Group.findOne({ _id: req.body.groupId });
        
        res.status(200).json(group);
    } catch (error) {
        next(error);
    }
}

// adds a task to a group based on groupId

export const addTask = async (req, res, next) => {
    try {
        const group = await Group.findOne({ _id: req.params.groupId })
        if(!group){
            res.status(404).json({message:'Group not found'})
            return 
        }
        const newTask = {
            title: req.body.title,
            time: req.body.time,
            date: req.body.date,
            content: req.body.content
        }
        if (!(req.body.title)) {
            res.status(400).json({ message: 'Enter proper task details' })
            return
        }
        group.tasks.push(newTask)
        await group.save()
        res.status(201).json(newTask)
    } catch (error) {
        next(error)
    }
}

// deletes a task from a group based on groupId
export const deleteTask = async (req, res, next) => {
    try {
        const group = await Group.findOne({_id: req.params.groupId })
        if(!group){
            res.status(404).json({message:'Group not found'})
            return 
        }
        group.tasks = group.tasks.filter(task => task.title !== req.body.title)
        await group.save()
        res.status(200).json("task deleted")
    } catch (error) {
        next(error)
    }
}

// adds a user to a group based on given details

export const addUser = async (req, res, next) => {
    try {
        const userInvites = req.body.ui
        const groupInvites = req.body.gi
        if(req.query.type === 'accept'){
            for(const invite of groupInvites){
                if(invite.selected){
                    const group = await Group.findOne({ _id: invite.groupId })
                    if(!group){
                        res.status(404).json({message:'Group not found'})
                        return
                    }
                    if(group.members.includes(req.body.userId)){
                        res.status(400).json({message: 'User already in group'})
                        return
                    }
                    group.members.push(req.body.userId)
                    await group.save()
                }
            }
            for(const groupId of Object.keys(userInvites)){
                const group = await Group.findOne({ _id: groupId })
                if(!group){
                    res.status(404).json({message:'Group not found'})
                    return
                }
                for(const invite of userInvites[groupId]){
                    if(invite.selected){
                        if(group.members.includes(invite.userId)){
                            res.status(400).json({message: 'User already in group'})
                            return
                        }
                        group.members.push(invite.userId)
                        await group.save()
                    }
                }
            }
            const user = await User.findOne({userId: req.body.userId})
            user.groupInvites = []
            user.userInvites = {}
            await user.save()
            res.status(201).json({message: 'User added to group'})
        } else if(req.query.type === 'reject'){
            const user = await User.findOne({userId: req.body.userId})
            user.groupInvites = []
            user.userInvites = {}
            await user.save()
            res.status(200).json({message: 'User rejected group invite'})
        }
    } catch (error) {
        next(error)
    }
}

// deletes a user from a group based on groupName
export const deleteUser = async (req, res, next) => {
    try {
        const group = await Group.findOne({groupName: req.params.groupName })
        if(!group){
            res.status(404).json({message:'Group not found'})
            return 
        }
        group.members = group.members.filter(user => user !== req.params.userName )
        await group.save()
        res.status(200).json("User deleted")
    } catch (error) {
        next(error)
    }
}