import express from 'express'
import { getGroups, getGroup, createGroup, deleteGroup, addTask, deleteTask, addUser, deleteUser } from '../controllers/groupController.js';

//create a router 
const router = express.Router()

// gets all group mini details based on query
router.get('/getGroups', getGroups)

//gets detailed group data based on groupId
router.get('/getGroup/:groupId', getGroup)

// creates a new group based on details
router.post('/createGroup', createGroup)

// deletes a group based on groupId
// router.post('/deleteGroup/:groupId', deleteGroup)

// add a user to a group based on given details
router.put('/addUser',addUser)

// //delete a user from a group based on groupId
// router.delete('/:groupId/user/:userId',deleteUser)

// add a Task to a group based on groupId
router.put('/addTask/:groupId', addTask)

// deletes a Task from a group based on groupId
router.post('/deleteTask/:groupId', deleteTask)

export default router