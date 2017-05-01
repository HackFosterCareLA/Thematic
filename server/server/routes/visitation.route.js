import express from 'express'
import validate from 'express-validation';
//import paramValidation from '../../config/param-validation';
import visitationCtrl from '../controllers/visitation.controller'

const router = express.Router() // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(visitationCtrl.list)

  /** POST /api/users - Create new user */
  .post(visitationCtrl.create)

  .delete(visitationCtrl.clear)

  /** PUT /api/users/:userId - Update user */
router.route('/:visitationId')
  .put(visitationCtrl.update)

  .get(visitationCtrl.getResponse)

  /** DELETE /api/users/:userId - Delete user */
  //.delete(visitationCtrl.remove)

/** Load user when API with userId route parameter is hit */
//router.param('validationId', visitationCtrl.load);

export default router
