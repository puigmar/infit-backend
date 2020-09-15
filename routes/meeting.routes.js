const express = require('express');
const moment = require('moment');
const router = express.Router();
const Meeting = require('../models/Meeting.model');
const ScheduleDay = require('../models/ScheduleDay.model');
const Coach = require('../models/Coach.model');
const Client = require('../models/Client.model');

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

router.get('/:meetingID', async (req, res, next) => {
  try{
    const { meetingID } = req.params;
    const theMeeting = await Meeting.findById({_id: meetingID})
    res.status(200).json(theMeeting);
  }
  catch(err) {
    console.log(err)
    next(error);
  }
});

router.post('/next', async (req, res, next) => {
  try {
    const { clientID, programID } = req.body;
    
    const now = Date.now();
    const meeting = await Meeting.findOne({ clientID , programID, finished: { $ne: true}})
                                 .populate('coachID', 'name avatarUrl')

    // chequear si la meeting ha pasado de hora y no se ha realizado
    let parseDBDate = moment.duration(new Date(meeting.date));
    let adding1hour = moment.duration(parseDBDate).add(1, 'hours');
    let finishMeetingTime = adding1hour.asMilliseconds()

    if(finishMeetingTime < now && meeting.finished === false){
      console.log('--------------------------------> tenemos que volver a generar una cita')
      //const meetingObj = meeting.toObject();

      const updateExistingMeeting = await Meeting.findOneAndUpdate(
        {_id: meeting._id},
        { $set: { 
            coachID: null, 
            userID: meeting.userID,
            finished: false,
            programID: meeting.programID,
            url: ""
          },
          $unset: { date: 1}
        },
        {
          upsert: true,
          new: true
        }
      )
      console.log('updateExistingMeeting ---------------> ', updateExistingMeeting)
      res.status(200).json(updateExistingMeeting); 
    }

    res.status(200).json(meeting); 
    
  } catch (error) {
    next(error);
  }
});

router.post('/coach/:coachID/next', async (req, res, next) => {
  try {
    const { coachID } = req.params;
    console.log(coachID)
    const now = new Date();
    const findCoach = await Coach.findOne({ _id: coachID});
    console.log('findCoach ------------->', findCoach)
    console.log('findCoach: ', findCoach._id)
    const meeting = await Meeting.findOne({ coachID: findCoach._id, finished: false, date: { $gte: now.toISOString()}})
    console.log('meeting ------------->', meeting)
    if(meeting){
      const user = await Client.findOne({ userID: meeting.userID}, {'name': 1, 'avatarUrl': 1})
      console.log('user ------------->', user)

      if(user) {
        res.status(200).json({
          meeting,
          user
        });
      }
    }
    
  } catch (error) {
    next(error);
  }
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

  } catch (error) {
    next(error);
  }
});

module.exports = router;
