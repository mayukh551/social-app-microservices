import express from 'express';

// import controllers
import { createPost, deletePost, getPost, updatePost, getPostByUserIdPost } from '../Controllers/post';
import upload from '../../config/multerConfig';
import { authUser } from '../Middlewares/authUser';

// extract router from express
const router = express.Router();

//* Routes

router.route('/').get((req, res) => res.send('Post Server is Live'));

// get a post
router.route('/:id').get(authUser, getPost);

// get all post
router.route('/byuser/:userId').get(authUser, getPostByUserIdPost);

// create a post
router.route('/create').post(authUser, upload.single('file'), createPost);

// update a post
router.route('/edit/:id').put(authUser, upload.single('file'), updatePost);

// delete a post
router.route('/delete/:id').delete(authUser, deletePost);

export default router;