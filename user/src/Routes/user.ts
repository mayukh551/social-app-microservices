import express from 'express';

// import controllers
import { deleteUser, getUser, signup, updateUser } from '../Controllers/user';

// extract router from express
const router = express.Router();

//* Routes

// get a user
router.route('/:id').get(getUser);

// create a new user
router.route('/signup').post(signup);

// user login
router.route('/login').post();

// update a user
router.route('/edit/:id').put(updateUser);

// delete a user
router.route('/delete/:id').delete(deleteUser);


export default router;