import express from 'express'
import ivrConfirmController from '../controllers/ivr.confirm.controller'

const router = express.Router()

router.route('/:role/:visitationId')
  .get(ivrConfirmController.startCall)

router.route('/language/:role/:visitationId')
  .post(ivrConfirmController.selectLanguage)

router.route('/setlanguage/:role/:visitationId')
  .get(ivrConfirmController.setLanguage)

router.route('/:language/:role/:visitationId')
  .post(ivrConfirmController.callPerson);


router.route('/:language/confirm/:role/:visitationId')
  .post(ivrConfirmController.confirm);


export default router

