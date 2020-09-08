const express = require('express');
const moment = require('moment');
const router = express.Router();
const Meeting = require('../models/Meeting.model');
const ScheduleDay = require('../models/ScheduleDay.model');

//CREATE
router.post('/newMeeting', async (req, res, next) => {
  console.log(req.body)
  try {
    const newMeeting = await Meeting.create({ ...req.body });
    res.status(200).json(newMeeting);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post('/next', async (req, res, next) => {
  try {
    const { clientID, programID } = req.body;
    //console.log(req.body)
    const meeting = await Meeting.find({ clientID , programID, finished: { $ne: true}})
                                 .populate('coachID', 'name avatarUrl')
    //console.log('Next meeting --------->', meeting)
    res.status(200).json(meeting);
  } catch (error) {}
});

router.put('/update', async (req, res, next) => {
  try {
    const { meeting } = req.body;
    console.log('meeting data: --------->', meeting)

    const updateMeeting = await Meeting.findOneAndUpdate(
      { '_id': meeting._id }, 
      { $set: { ...meeting } },
      {new: true}
    )
    
    console.log('updateMeeting ------------------->', updateMeeting)

    if(updateMeeting){
      const dateFormat = moment(updateMeeting.date).format('YYYY-MM-DD');
      const existScheduleDay = await ScheduleDay.find({'date': dateFormat})
      console.log('existScheduleDay ------------------->', existScheduleDay)
    }

    const dateFormat = moment(meeting.date).format('YYYY-MM-DD');
    const hour = moment(meeting.date).format('HH');
    console.log('dateFormat: ------->', dateFormat)
    console.log('hour -------->', hour);
    const existScheduleDay = await ScheduleDay.findOne({'date': dateFormat, 'coachID': meeting.coachID})

    console.log('existScheduleDay -------->', existScheduleDay);

    if(existScheduleDay){
      console.log('existe...')
      const updteScheduleDay = await ScheduleDay.findOneAndUpdate(
        {'_id': existScheduleDay._id},
        { $push: { meetingIDs: meeting._id, occupedAt: { $each: [hour], $sort: 1 } } },
        { new: true }
      )
      console.log('updteScheduleDay -------->', updteScheduleDay);
    } else {
      const createScheduleDay = await ScheduleDay.create({
        trainingIDs: [],
        meetingIDs: meeting._id,
        occupedAt: hour,
        coachID: meeting.coachID,
        date: dateFormat
      })

      console.log('createScheduleDay -------->', createScheduleDay);
    }

    res.status(200).json(updateMeeting);

  } catch (error) {}
});

module.exports = router;
