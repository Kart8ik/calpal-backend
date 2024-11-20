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

// Define the Group schema

const GroupSchema = new mongoose.Schema({
    groupName: { type: String, required: true },
    groupDescription: { type: String, required: true },
    members: { type: Array, required: true },
    groupTasks: { type: Array, required: true },
});

// Create a Group model
const Group = mongoose.model('Group', GroupSchema);

// functions to deal with all endpoints related to groups

// Get all groups
export const getGroups = async (req, res, next) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
}

// Get a group based on groupName
export const getGroup = async (req, res, next) => {
    try {
        const group = await Group.findOne({ groupName: req.params.groupName });
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
            groupName: req.body.groupName,
            groupDescription: req.body.groupDescription,
            members: req.body.members,
            groupTasks: req.body.groupTasks,
        });
        if (!(req.body.groupName)) {
            res.status(400).json({ message: 'Enter proper group details' })
            return
        }
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        next(error);
    }
}

// delete a group based on groupName

export const deleteGroup = async (req, res, next) => {
    try {
        const group = await Group.findOneAndDelete({ groupName: req.params.groupName });
        res.status(200).json(group);
    } catch (error) {
        next(error);
    }
}

// adds a task to a group based on groupName

export const createTask = async (req, res, next) => {
    try {
        const group = await Group.findOne({ groupName: req.params.groupName })
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
        group.groupTasks.push(newTask)
        await group.save()
        res.status(201).json(group)
    } catch (error) {
        next(error)
    }
}

// deletes a task from a group based on groupName
export const deleteTask = async (req, res, next) => {
    try {
        const group = await Group.findOne({groupName: req.params.groupName })
        if(!group){
            res.status(404).json({message:'Group not found'})
            return 
        }
        group.groupTasks = group.groupTasks.filter(task => task.title !== req.params.title)
        await group.save()
        res.status(200).json("task deleted")
    } catch (error) {
        next(error)
    }
}

// adds a user to a group based on groupName

export const addUser = async (req, res, next) => {
    try {
        const group = await Group.findOne({ groupName: req.params.groupName })
        if(!group){
            res.status(404).json({message:'Group not found'})
            return 
        }
        group.members.push(req.params.userName)
        await group.save()
        res.status(201).json(group)
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