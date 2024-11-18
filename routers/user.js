import express from 'express'
import { getUsers, getUser, createUser, createTask, deleteTask, addFriend, deleteFriend } from '../controllers/userController.js'


const router = express.Router()

// gets all users
router.get('/', getUsers) //done

//gets a user based on username
router.get('/:username', getUser) //done

// creates a new user
router.post('/', createUser) //done

//adds a task to a user
router.put('/:username', createTask) //done

// deletes a task from a user
router.delete('/tasks/:username/title/:title', deleteTask) //done

// add a friend to a user
router.put('/:username/friend/:friend', addFriend) //done

// deletes a friend from a user
router.delete('/:username/friend/:friend', deleteFriend) //done

// exports the router
export default router

