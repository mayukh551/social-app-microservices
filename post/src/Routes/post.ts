import express from 'express';

// import controllers
import { createPost, deletePost, getPost, updatePost, getgetPostByUserIdPost } from '../Controllers/post';
import upload from '../../config/multerConfig';

// extract router from express
const router = express.Router();

//* Routes

router.route('/').get((req, res) => res.send('Post Server is Live'));

// get a post
router.route('/:id').get(getPost);

// get all post
router.route('/byuser/:userId').get(getgetPostByUserIdPost);

// create a post
router.route('/create').post(upload.single('file'), createPost);

// update a post
router.route('/edit/:id').put(upload.single('file'), updatePost);

// delete a post
router.route('/delete/:id').delete(deletePost);

export default router;