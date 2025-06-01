import express from 'express'
import { getUsers, getUser, createUser, createTask, deleteTask, requestGroup, getUsersTaskInfo} from '../controllers/userController.js'


const router = express.Router()

// gets all users or basic user details based on query
router.get('/', getUsers) 

//gets users task info based on array of userIds
router.post('/getUsersTaskInfo', getUsersTaskInfo)

//gets a user based on userId
router.get('/:userId', getUser) //done

// creates a new user
router.post('/', createUser) //done

// requests to join a group
router.post('/requestGroup', requestGroup)

//adds a task to a user
router.put('/:userId', createTask) //done

// deletes a task from a user
router.delete('/deletetask/:userId', deleteTask) //done

// //send group owner request to join a group
// router.put('/:userId/group/:groupId', sendGroupInvite)

// exports the router
export default router

