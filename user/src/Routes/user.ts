import express from 'express';

// import controllers
import { deleteUser, getUser, updateUser } from '../Controllers/user';
import { signup, login } from '../Controllers/auth';
import { authUser } from '../Middlewares/authUser';

// extract router from express
const router = express.Router();

//* Routes

//* test route
router.route('/').get((req, res) => res.send("User Server is Live"));

// get a user
router.route('/:id').get(authUser, getUser);

// update a user
router.route('/edit/:id').put(authUser, updateUser);

// delete a user
router.route('/delete/:id').delete(authUser, deleteUser);


//******************************* Authentication *******************************************


// create a new user
router.route('/signup').post(signup);

// user login
router.route('/login').post(login);


export default router;