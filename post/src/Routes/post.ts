import express from 'express';

// import controllers
import { createPost, deletePost, getPost, updatePost, getgetPostByUserIdPost } from '../Controllers/post';

// extract router from express
const router = express.Router();

//* Routes

// get a post
router.route('/:id').get(getPost);


// get all post
router.route('/byuser/:userId').get(getgetPostByUserIdPost);

// create a post
router.route('/create').post(createPost);

// update a post
router.route('/edit/:id').put(updatePost);

// delete a post
router.route('/delete/:id').delete(deletePost);


export default router;