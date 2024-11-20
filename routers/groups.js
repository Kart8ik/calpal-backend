import express from 'express'
import { getGroups, getGroup, createGroup, deleteGroup, createTask, deleteTask, addUser, deleteUser } from '../controllers/groupController.js';

//create a router 
const router = express.Router()

// gets all groups
router.get('/', getGroups)

//gets a group based on groupName
router.get('/:groupName', getGroup)

// creates a new group
router.post('/', createGroup)

// deletes a group based on groupName
router.delete('/:groupName', deleteGroup)

// add a user to a group based on groupName
router.put('/:groupName/userName/:userName',addUser)

//delete a user from a group based on groupName
router.delete('/:groupName/userName/:userName',deleteUser)

// add a Task to a group based on groupName
router.put('/:groupName', createTask)

// deletes a Task from a group based on groupName
router.delete('/:groupName/title/:title', deleteTask)

export default router