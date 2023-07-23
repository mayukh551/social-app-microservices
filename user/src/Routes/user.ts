import express from 'express';

// import controllers
import { createUser, deleteUser, getUser, updateUser } from '../Controllers/user';

// extract router from express
const router = express.Router();

//* Routes

// get a user
router.route('/:id').get(getUser);

// create a user
router.route('/new').post(createUser);

// update a user
router.route('/edit/:id').put(updateUser);

// delete a user
router.route('/delete/:id').delete(deleteUser);


export default router;