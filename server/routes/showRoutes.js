import express from 'express';

import { getNowPlayingMovies , addShow, getShows , getShow, addMovie} from '../controllers/showController.js';
import { protectAdmin } from '../middleware/auth.js';


const showRouter = express.Router();
showRouter.post("/addMovie", addMovie);
showRouter.get('/now-playing', getNowPlayingMovies);
showRouter.post('/add', protectAdmin, addShow);
showRouter.get("/all", getShows);
showRouter.get("/:movieId", getShow);
export default showRouter;

