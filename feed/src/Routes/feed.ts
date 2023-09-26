import express from 'express';

// import controllers
import { authUser } from '../Middlewares/authUser';
import { createFollow, getFeedPosts } from '../Controllers/feed';

// extract router from express
const router = express.Router();

//* Routes

router.route('/:id').get(authUser, getFeedPosts);
router.route('/follow')
    .post(authUser, createFollow)
    .delete(authUser)

export default router;