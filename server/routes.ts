import * as express from 'express';

import CityController from './controllers/CityController';
import UserController from './controllers/UserController';
import RecrutController from './controllers/RecrutController';
import StudentController from './controllers/StudentController';
// import city from './models/city';
// import user from './models/user';

export default function routes(app) {

  const router = express.Router();

  const recrut = new RecrutController();
  const city = new CityController();
  const user = new UserController();
  const student = new StudentController();

  // recruts
  router.route('/recruts').get(recrut.getAll);
  router.route('/recruts/count').get(recrut.count);
  router.route('/recrut').post(recrut.insert);
  router.route('/recrut/:id').get(recrut.get);
  router.route('/recrut/:id').put(recrut.update);
  router.route('/recrut/:id').delete(recrut.delete);

  // students
  router.route('/students').get(student.getAll);
  router.route('/students/count').get(student.count);
  router.route('/student').post(student.insert);
  router.route('/student/:id').get(student.get);
  router.route('/student/:id').put(student.update);
  router.route('/student/:id').delete(student.delete);

  // cities
  router.route('/cities').get(city.getAll);
  router.route('/cities/count').get(city.count);
  router.route('/city').post(city.insert);
  router.route('/city/:id').get(city.get);
  router.route('/city/:id').put(city.update);
  router.route('/city/:id').delete(city.delete);

  // users
  router.route('/login').post(user.login);
  router.route('/users').get(user.getAll);
  router.route('/users/count').get(user.count);
  router.route('/user').post(user.insert);
  router.route('/user/:id').get(user.get);
  router.route('/user/:id').put(user.update);
  router.route('/user/:id').delete(user.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
