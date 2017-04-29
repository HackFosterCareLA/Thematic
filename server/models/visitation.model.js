import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import User from './user.model'

const Schema = mongoose.Schema

const VisitationSchema = new Schema({
  caseNumber: {
    type: String,
    required: true
  },
  datetime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
    //match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  isWeekly: {
    type: Boolean,
    required: true
  },
  parentId: {
    type: Schema.ObjectId,
    required: true
  },
  caregiverId: {
    type: Schema.ObjectId,
    required: true
  },
  childId: {
    type: Schema.ObjectId,
    required: true
  },
  socialWorkerId: {
    type: Schema.ObjectId,
    required: true
  }
})

/**
 * Methods
 */
VisitationSchema.method({
})

/**
 * Statics
 */
VisitationSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((visitation) => {
        if (visitation) {
          return visitation
        } else {
          return Promise.reject('Visitation not found')
        }
    })
  },

  getResponse(id) {
    const returnValue = {}

    return this.findById(id)
      .exec()
      .then((visitation) => {
        if (visitation) {
          returnValue._id = visitation._id
          returnValue.datetime = visitation.datetime
          returnValue.location = visitation.location
          returnValue.isWeekly = visitation.isWeekly
          returnValue.childId = visitation.childId
          returnValue.caregiverId = visitation.caregiverId
          returnValue.parentId = visitation.parentId
          returnValue.socialWorkerId = visitation.socialWorkerId

          return User.get(visitation.parentId)
        }

        const err = new APIError('No such visitation exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      })
      .then((parent) => {
        returnValue.parent = null
        if (parent) {
          returnValue.parent = parent
        }

        return User.get(returnValue.childId)
      })
      .then((child) => {
        returnValue.child = null
        if (child) {
          returnValue.child = child
        }

        return User.get(returnValue.caregiverId)
      })
      .then((caregiver) => {
        returnValue.caregiver = null
        if (caregiver) {
          returnValue.caregiver = caregiver
        }
        return User.get(returnValue.socialWorkerId)
      })
      .then((socialWorker) => {
        returnValue.socialWorker = null
        if (socialWorker) {
          returnValue.socialWorker = socialWorker
        }

        return returnValue
      })
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  // list({ skip = 0, limit = 50 } = {}) {
  //   return this.find()
  //     .sort({ createdAt: -1 })
  //     .skip(+skip)
  //     .limit(+limit)
  //     .exec();
  // }
};

/**
 * @typedef User
 */
export default mongoose.model('Visitation', VisitationSchema)
