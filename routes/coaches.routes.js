const express = require('express');
const router = express.Router();
const moment = require('moment');
const Coach = require('../models/Coach.model');
const ScheduleDay = require('../models/ScheduleDay.model');

//CREATE
router.post('/byAvailability', async (req, res, next) => {
  try {
    const { min, max } = req.body;
    console.log('req.body ----------->', req.body)
    const coachAvailable = await Coach.find({'availability.min': { $gte: Number(min), $lte: Number(max)-1}, 'availability.max':  { $gte: Number(max)}})
    res.status(200).json(coachAvailable);

  } catch (error) {
    console.log(error);
    next(error);
  }
});


// let calendar = {
//   "2020-09-07": [
//     { 
//       id: "342342342342", 
//       horario_libre: [9,10,12]
//     },
//     { 
//       id: "342342342342", 
//       horario_libre: [9,11,14]
//     }
//   ]
// };

router.post('/byCallAvailability', async (req, res, next) => {
  try {
    // Recogemos coaches que coinciden conla franja horaria
    const { availableCoaches } = req.body;
    var calendar = {};

    // recorremos cada uno de los coach disponibles
    for(let i = 0; i < availableCoaches.length; i++){

      // recorremos la tabla scheduleDay para devolver todos los resultados asociados a la id del coach
      let daysByCoach = await ScheduleDay.find({coachID: availableCoaches[i]._id})

      // reorremos cada resultado relacionado con el coach
      daysByCoach.forEach( theCoach => {

        // generamos el nombre de la key de cada día de nuestro objeto calendario
        let calendarDay = moment(theCoach.date).format('YYYY-MM-DD'); 

        // Sacamos horas libres
        let hoursAvailables = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        let busyHours = theCoach.occupedAt;
        hoursAvailables.map( (hour, index) => {
          busyHours.includes(hour) && hoursAvailables.splice(index, 1);
        })

        // construímos la información del coach con id y horario para nuestro objeto calendario
        let coachInfo =  { 
          id: theCoach.coachID, 
          horario_libre: hoursAvailables
        }

        // asignamos la información del coach a la key del día del calendario
        // si la key del día ya existe hacemos un push a ese día
        // de lo contrario generamos la nueva key con la info
        if(!calendar[calendarDay]){
          calendar[calendarDay] = [coachInfo]
        } else {
          calendar[calendarDay].push(coachInfo)
        }
      })
    }

    console.log('calendar: ', calendar)

    res.status(200).json(calendar);

  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
