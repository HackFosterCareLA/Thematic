import express from 'express'
import ivrConfirmController from '../controllers/ivr.confirm.controller'

const router = express.Router()

router.route('/:role/:visitationId')
  .get(ivrConfirmController.startCall);


router.route('/parent/:visitationId')
  .post(ivrConfirmController.callParent);

router.route('/caregiver/:visitationId')
  .post(ivrConfirmController.callCaregiver);

router.route('/confirm/:role/:visitationId')
  .post(ivrConfirmController.confirm);


export default router
