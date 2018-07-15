require('./db/mongoose')
const {Event} = require('./models/event')
const _pick = require('lodash/pick')
require('request')
const {ObjectId} = require('mongodb')
const {sendNotification} = require('./onesignal/create')
const {deleteNotification} = require('./onesignal/cancel')
const {User} = require('./models/user')
const {authenticate} = require('./middleware/authenticate')
const {authenticateLogout} = require('./middleware/authenticate-logout')

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
    let event = await Event.findById({
      _id: id
    })

    if (event.player_id.length === 0 || event.player_id.indexOf(req.body.user_id) < 0) {
      var EventDate = new Date(event.date)

      var NotiDate = new Date(EventDate.getTime() - 20000 * 60)

      var message = {
        app_id: `${process.env.ONESIGNAL_APP_ID}`,
        contents: {'en': `Your event ${event.name} is going to start in 20 minutes`},
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
        x.save()
      })
    } else {
      res.status(406).send()
    }
  })

  // CREATE EVENT
  app.post('/events', authenticate, async (req, res) => {
    if (req.user.name !== 'User') {
      const event = new Event({
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        creator: req.user.username
      })

      try {
        const doc = await event.save()
        res.send(doc)
      } catch (e) {
        res.status(400).send(e)
      };
    } else {
      res.status(400).send('Change Name before creating an event.')
    }
  })

  // SHOW EVENT WITH ID

  app.get('/events/:id', async (req, res) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)) {
      return res.status(400).send()
    }

    try {
      const event = await Event.findById(id)
      if (!event) {
        return res.status(400).send()
      }

      res.status(200).send({event})
    } catch (e) {
      res.status(400).send(e)
    }
  })

  // DELETE EVENT ROUTE

  app.delete('/events/:id', authenticate, async (req, res) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)) {
      return res.status(404).send()
    }

    try {
      let event1 = await Event.findById({
        _id: id
      })

      if (event1.creator === req.user.username) {
        for (var i = 0, len = event1.notification_id.length; i < len; i++) {
          if (event1.notification_id[i] !== null) {
            deleteNotification(event1.notification_id[i])
          }
        }
        const event = await Event.findByIdAndRemove(id)

        if (!event) {
          return res.status(404).send()
        }

        res.send({event})
      } else {
        res.status(401).send()
      }
    } catch (e) {
      res.status(400).send()
    };
  })

  // UPDATE EVENT WITH GIVEN EVENT ID

  app.patch('/events/:id', authenticate, async (req, res) => {
    const id = req.params.id
    const body = _pick(req.body, ['name', 'description', 'date'])

    if (!ObjectId.isValid(id)) {
      return res.status(400).send()
    }

    let event1 = await Event.findById({
      _id: id
    })

    if (req.user.username === event1.creator) {
      if (event1.date !== req.body.date) {
        for (var i = 0, len = event1.notification_id.length; i < len; i++) {
          if (event1.notification_id[i] !== null) {
            deleteNotification(event1.notification_id[i])
          }
        }

        var EventDate = new Date(req.body.date)

        var NotiDate = new Date(EventDate.getTime() - 20000 * 60)

        var message = {
          app_id: `${process.env.ONESIGNAL_APP_ID}`,
          contents: {'en': `Your event ${body.name} is going to start in 20 minutes`},
          send_after: NotiDate,
          include_player_ids: event1.player_id
        }

        sendNotification(message, (err, result) => {
          if (err) {
            res.status(400).send(err)
          }
          console.log('updated and sent')
        })
      }

      try {
        const event = await Event.findByIdAndUpdate(id, {$set: body}, {new: true})
        res.status(200).send(event)
      } catch (e) {
        res.status(400).send()
      }
    } else {
      res.status(401).send()
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
      'http://yashasingh.tech:8085/api/profiles/login/',
      { json: true,
        body: values },
      function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var data = _pick(body, ['username', 'group'])

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
        }
      }
    )
  })

  app.delete('/logout', authenticateLogout, async (req, res) => {
    try {
      await req.user.removeToken(req.token)
      res.status(200).send()
    } catch (e) {
      res.status(400).send()
    }
  })

  app.get('/dashboard', authenticate, async (req, res) => {
    try {
      let UpcomingEvents = []
      const user = req.user
      let events = await Event.find({ creator: user.username }).sort({isodate: 'asc'})

      for (var i = 0; i < events.length; i++) {
        if (new Date(events[i].date) >= new Date()) {
          UpcomingEvents.push(events[i])
        }
      }

      res.send(UpcomingEvents)
    } catch (e) {
      res.status(400).send()
    }
  })

  app.post('/user', authenticate, async (req, res) => {
    let body = _pick(req.body, ['name'])

    try {
      const user = await User.findByIdAndUpdate({_id: req.user.id}, {$set: body}, {new: true})
      res.status(200).send(user)
    } catch (e) {
      res.status(400).send()
    }
  })
}
