import Visitation from '../models/visitation.model';
import util from 'util'

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  Visitation.get(id)
    .then((visitation) => {
      req.visitation = visitation; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res, next, id) {
  return res.json(req.visitation)
}

function getResponse(req, res) {
  return Visitation.getResponse(req.params.visitationId)
    .then((visitationResponse) => res.json(visitationResponse))
    .catch((reason) => res.json(reason))
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const visitation = new Visitation({
    datetime: req.body.datetime,
    location: req.body.location,
    isWeekly: req.body.isWeekly,
    parentId: req.body.parentId,
    caregiverId: req.body.caregiverId,
    childId: req.body.childId,
    socialWorkerId: req.body.socialWorkerId
  })

  visitation.save()
    .then(savedVisitation => res.json(savedVisitation))
    .catch(e => next(e))
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  //console.log('visition: ' + util.inspect(req.visitation))
  Visitation.get(req.params.visitationId)
    .then((visitation) => {
      visitation.datetime = req.body.datetime
      visitation.location = req.body.location
      visitation.isWeekly = req.body.isWeekly
      visitation.parentId = req.body.parentId
      visitation.caregiverId = req.body.caregiverId
      visitation.childId = req.body.childId
      visitation.socialWorkerId = req.body.socialWorkerId
      visitation.caseNumber = req.body.caseNumber

      visitation.save()
        .then(savedVisitation => res.json(savedVisitation))
        .catch(e => next(e))
    })

}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
// function list(req, res, next) {
//   const { limit = 50, skip = 0 } = req.query;
//   User.list({ limit, skip })
//     .then(users => res.json(users))
//     .catch(e => next(e));
// }

/**
 * Delete user.
 * @returns {User}
 */
// function remove(req, res, next) {
//   const user = req.user;
//   user.remove()
//     .then(deletedUser => res.json(deletedUser))
//     .catch(e => next(e));
// }

export default {
  load,
  get,
  create,
  update,
  getResponse
  //list, remove
}
