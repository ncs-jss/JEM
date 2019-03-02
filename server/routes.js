require('./db/mongoose')
const {Event} = require('./models/event')
const _pick = require('lodash/pick')
require('request')
const {ObjectId} = require('mongodb')
const {sendNotification} = require('./onesignal/create')
const {deleteNotification} = require('./onesignal/cancel')
const {User} = require('./models/user')
const {authenticate} = require('./middleware/authenticate')

module.exports = app => {
  app.get('/', async (req, res) => {
    try {
      let UpcomingEvents = []
      let events = await Event.find({}).sort({isodate: 'asc'})

      for (var i = 0; i < events.length; i++) {
        if (new Date(events[i].date) >= new Date()) {
          UpcomingEvents.push(events[i])
        }
      }

      res.send(UpcomingEvents)
    } catch (e) {
      res.status(400).send(e)
    }
  })

  app.post('/', async (req, res) => {
    let id = req.body.event_id

    if (req.body.user_id == 'null' || req.body.user_id == null || req.body.event_id == null) {
      res.status(400).send('Subscribe to notifications first')
    }

    let event = await Event.findById({
      _id: id
    })

    if (event.player_id.length == 0 || event.player_id.indexOf(req.body.user_id) < 0) {
      var EventDate = new Date(event.date)
      var NotiDate = new Date(EventDate.getTime() - 60 * 60000)
      var message = {
        app_id: `${process.env.ONESIGNAL_APP_ID}`,
        contents: {'en': `Your event ${event.name} is going to start in 1 hour at ${event.venue}`},
        send_after: NotiDate,
        include_player_ids: [req.body.user_id]
      }

      sendNotification(message, (err, result) => {
        if (err) {
          res.status(400).send(err)
        }
        event.notification_id.push(result.id)
        event.player_id.push(req.body.user_id)
        var x = event
        x.save().then(() => {
          var NotiDate = new Date(EventDate.getTime() - 30 * 60000)
          var message = {
            app_id: `${process.env.ONESIGNAL_APP_ID}`,
            contents: {'en': `Your event ${event.name} is going to start in 30 minutes at ${event.venue}`},
            send_after: NotiDate,
            include_player_ids: [req.body.user_id]
          }

          sendNotification(message, (err, result) => {
            if (err) {
              res.status(400).send(err)
            }
            event.notification_id.push(result.id)
            var x = event
            x.save()
            res.status(200).send()
          })
        }).catch((e) => {
          res.status(400).send()
        })
      })
    } else {
      res.status(400).send('Already subscribed for this event.')
    }
  })

  // CREATE EVENT
  app.post('/events', authenticate, async (req, res) => {
    if (req.user.name !== 'User') {
      const event = new Event({
        name: req.body.name,
        description: req.body.description,
        venue: req.body.venue,
        date: req.body.date,
        creator: req.user.username,
        creatorname: req.user.name
      })

      try {
        const doc = await event.save()
        res.send(doc)
      } catch (e) {
        res.status(400).send('Unable to create an event')
      };
    } else {
      res.status(400).send('Change Name before creating an event.')
    }
  })

  // SHOW EVENT WITH ID

  app.get('/events/:id', async (req, res) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)) {
      return res.status(400).send('event ID is not valid.')
    }

    try {
      const event = await Event.findById(id)
      if (!event) {
        return res.status(400).send('Event does not exist')
      }

      res.status(200).send({event})
    } catch (e) {
      res.status(400).send(e)
    }
  })

  // PAST EVENTS LIST

  app.get('/past/events', async (req, res) => {
    try {
      let PastEvents = []
      let events = await Event.find({}).sort({isodate: 'desc'})

      for (var i = 0; i < events.length; i++) {
        if (new Date(events[i].date) < new Date()) {
          PastEvents.push(events[i])
        }
      }
      if (PastEvents.length == 0) {
        res.status(200).send('No Past Event')
      } else {
        res.status(200).send(PastEvents)
      }
    } catch (e) {
      res.status(400).send(e)
    }
  })
  // DELETE EVENT ROUTE

  app.delete('/events/:id', authenticate, async (req, res) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)) {
      return res.status(404).send('ID is not valid')
    }

    try {
      let event1 = await Event.findById({
        _id: id
      })

      if ((event1.creator == req.user.username) || (req.user == 'admin')) {
        if (event1.date > new Date()) {
          for (var i = 0, len = event1.notification_id.length; i < len; i++) {
            if (event1.notification_id[i] !== null) {
              deleteNotification(event1.notification_id[i])
            }
          }
        }
        const event = await Event.findByIdAndRemove(id)

        if (!event) {
          return res.status(404).send()
        }

        res.status(200).send({event})
      } else {
        res.status(401).send('Unauthorized User, Please login to continue.')
      }
    } catch (e) {
      res.status(400).send('Something went wrong, please try again.')
    };
  })

  // UPDATE EVENT WITH GIVEN EVENT ID

  app.patch('/events/:id', authenticate, async (req, res) => {
    const id = req.params.id
    const body = _pick(req.body, ['name', 'description', 'date', 'venue'])

    if (!ObjectId.isValid(id)) {
      return res.status(400).send('Event Id is not valid')
    }

    let event1 = await Event.findById({
      _id: id
    })

    if (req.user.username == event1.creator) {
      if ((event1.date !== req.body.date) ) {
        for (var i = 0, len = event1.notification_id.length; i < len; i++) {
          if (event1.notification_id[i] !== null) {
            deleteNotification(event1.notification_id[i])
          }
        }

        var EventDate = new Date(req.body.date)

        var NotiDate = new Date(EventDate.getTime() - 30000 * 60)

        var message = {
          app_id: `${process.env.ONESIGNAL_APP_ID}`,
          contents: {'en': `Your event ${body.name} is going to start in 30 minutes at ${body.venue}`},
          send_after: NotiDate,
          include_player_ids: event1.player_id
        }

        sendNotification(message, (err, result) => {
          if (err) {
            res.status(400).send(err)
          }
        })

        var NotiDate = new Date()
        var message = {
          app_id: `${process.env.ONESIGNAL_APP_ID}`,
          contents: {'en': `Event ${body.name} is rescheduled at ${req.body.date}`},
          send_after: NotiDate,
          include_player_ids: event1.player_id
        }

        sendNotification(message, (err, result) => {
          if (err) {
            res.status(400).send(err)
          }
        })
      }

      if (event1.venue !== req.body.venue) {
        for (var i = 0, len = event1.notification_id.length; i < len; i++) {
          if (event1.notification_id[i] !== null) {
            deleteNotification(event1.notification_id[i])
          }
        }



        var NotiDate = new Date()

        var message = {
          app_id: `${process.env.ONESIGNAL_APP_ID}`,
          contents: {'en': `Event ${body.name} has a new venue - ${body.venue}`},
          send_after: NotiDate,
          include_player_ids: event1.player_id
        }

        sendNotification(message, (err, result) => {
          if (err) {
            res.status(400).send(err)
          }
        })
      }

      try {
        Event.findById(id, function(err, doc) {
          doc.name = body.name
          doc.description = body.description
          doc.date = body.date
          doc.venue = body.venue
          doc.save(function(err, doc) {
            if(err){
              res.status(400).send(err)
            } else{
           res.status(200).send(doc)
            }
          })
        })





      } catch (e) {
        res.status(400).send('Something went wrong.')
      }
    } else {
      res.status(401).send('Unauthorized User, Please login to continue.')
    }
  })

  // LOGIN
  app.post('/login', (req, res) => {
    var values = {
      username: `${req.body.username}`,
      password: `${req.body.password}`
    }

    var request = require('request')

    request.post(
      'http://210.212.85.155/api/profiles/login/',
      { json: true,
        body: values },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var data = _pick(body, ['username', 'group'])
          if (data.group !== 'student') {
            User.findOne({username: data.username}).then((user) => {
              if (!user) {
                var newuser = new User(data)
                newuser.save().then(() => {
                  newuser.generateAuthToken().then((token) => {
                    res.header('x-auth', token).send({username: newuser.username, name: newuser.name})
                  })
                })
              } else {
                user.generateAuthToken().then((token) => {
                  res.header('x-auth', token).send({username: user.username, name: user.name})
                })
              }
            })
          } else {
            res.status(401).send('Permission denied.')
          }
        } else {
          res.status(401).send('Invalid login credentials.')
        }
      }
    )
  })

  // app.get('/in', (req, res) => {
  //
  //   var request = require('request')
  //   var dict = []
  //   request.get(
  //     'http://backoffice.zealicon.in/api/society',
  //     { json: true},
  //     function (error, response, body) {
  //       if (!error && response.statusCode == 200) {
  //
  //           for(var i in body["data"]){
  //             var p = body["data"][i]
  //             dict[p["id"]] = p["username"]
  //
  //         }
  //       }
  //     }
  //   )
  //
  //   request.get(
  //     'http://backoffice.zealicon.in/api/event',
  //     { json: true},
  //     function (error, response, body) {
  //       if (!error && response.statusCode == 200) {
  //         p = []
  //           for(var i in body["data"]){
  //             p = body["data"][i]
  //             const event = new Event({
  //               name: p["name"],
  //               description: p["description"],
  //               date: "Tue Mar 05 2019 19:30:49 GMT+0530 (IST)",
  //               creator: dict[p["society_id"]]
  //             })
  //
  //
  //               const doc = event.save()
  //         }
  //           res.status(200).send('ok done')
  //       } else {
  //         res.status(401).send('Invalid login credentials.')
  //       }
  //     }
  //   )
  // })



  app.delete('/logout', authenticate, async (req, res) => {
    try {
      await req.user.removeToken(req.token)
      res.status(200).send('Logout Successful.')
    } catch (e) {
      res.status(400).send('Something went wrong.')
    }
  })

  app.get('/dashboard', authenticate, async (req, res) => {
    try {
      let UpcomingEvents = []
      let PastEvents = []
      const user = req.user
      let events = await Event.find({ creator: user.username }).sort({isodate: 'asc'})

      for (var i = 0; i < events.length; i++) {
        if (new Date(events[i].date) >= new Date()) {
          UpcomingEvents.push(events[i])
        } else {
          PastEvents.push(events[i])
        }
      }
      PastEvents = PastEvents.reverse()

      if (PastEvents.length > 0) {

      } else {
        PastEvents = ['No Past Events.']
      }

      if (UpcomingEvents.length > 0) {

      } else {
        UpcomingEvents = ['No Upcoming Events.']
      }

      res.send({UpcomingEvents, PastEvents})
    } catch (e) {
      res.status(400).send()
    }
  })

  app.post('/user', authenticate, async (req, res) => {
    let body = _pick(req.body, ['name'])

    try {
      const user = await User.findByIdAndUpdate({_id: req.user.id}, {$set: body}, {new: true})

      Event.update({creator: user.username}, {creatorname: req.body.name}, {multi: true},
    function(err, num) {

    }
    )
      res.status(200).send(user)
    } catch (e) {
      res.status(400).send('Something went wrong')
    }
  })


  app.get('/day1', async (req, res) => {
    try {
      let UpcomingEvents = []
      let events = await Event.find({}).sort({isodate: 'asc'})
      for (var i = 0; i < events.length; i++) {
        var a = new Date(events[i].date)
        if ( a.getDate() == 5 ) {
          UpcomingEvents.push(events[i])
        }
      }

      res.send(UpcomingEvents)
    } catch (e) {
      res.status(400).send(e)
    }
  })

  app.get('/day2', async (req, res) => {
    try {
      let UpcomingEvents = []
      let events = await Event.find({}).sort({isodate: 'asc'})
      for (var i = 0; i < events.length; i++) {
        var a = new Date(events[i].date)
        if ( a.getDate() == 6 ) {
          UpcomingEvents.push(events[i])
        }
      }

      res.status(200).send(UpcomingEvents)
    } catch (e) {
      res.status(400).send(e)
    }
  })
  app.get('/day3', async (req, res) => {
    try {
      let UpcomingEvents = []
      let events = await Event.find({}).sort({isodate: 'asc'})
      for (var i = 0; i < events.length; i++) {
        var a = new Date(events[i].date)
        if ( a.getDate() == 7 ) {
          UpcomingEvents.push(events[i])
        }
      }

      res.send(UpcomingEvents)
    } catch (e) {
      res.status(400).send(e)
    }
  })
  app.get('/day4', async (req, res) => {
    try {
      let UpcomingEvents = []
      let events = await Event.find({}).sort({isodate: 'asc'})
      for (var i = 0; i < events.length; i++) {
        var a = new Date(events[i].date)
        if ( a.getDate() == 8 ) {
          UpcomingEvents.push(events[i])
        }
      }

      res.send(UpcomingEvents)
    } catch (e) {
      res.status(400).send(e)
    }
  })
}
