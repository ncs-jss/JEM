require('./db/mongoose')
const {Event} = require('./models/event')
const _pick = require('lodash/pick')
const request = require('request')
const {ObjectId} = require('mongodb')
const {sendNotification} = require('./onesignal/create')
const {deleteNotification} = require('./onesignal/cancel')

var sess

module.exports = app => {
  app.get('/', async (req, res) => {
    try {
      let events = await Event.find({}).sort({isodate: 'asc'})
      res.send(events)
    } catch (e) {
      res.status(400).send(e)
    }

    //  res.render(__dirname + '/views/home', {
    //   events
    // });
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
        app_id: 'd3d99984-794f-4c25-bedb-5cb810d8ed86',
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
  app.post('/events', async (req, res) => {
    sess = req.session
    if (sess.username) {
      const event = new Event({
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        creator: sess.username
      })

      try {
        const doc = await event.save()
        res.send(doc)
      } catch (e) {
        res.status(400).send(e)
      };
    } else {
      res.status(401).send()
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

  app.delete('/events/:id', async (req, res) => {
    sess = req.session
    if (sess.username) {
      const id = req.params.id

      if (!ObjectId.isValid(id)) {
        return res.status(404).send()
      }

      try {
        let event1 = await Event.findById({
          _id: id
        })

        if (event1.creator === sess.username) {
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
    } else {
      res.status(401).send()
    }
  })

  // UPDATE EVENT WITH GIVEN EVENT ID

  app.patch('/events/:id', async (req, res) => {
    sess = req.session
    if (sess.username) {
      const id = req.params.id
      const body = _pick(req.body, ['name', 'description', 'date'])

      if (!ObjectId.isValid(id)) {
        return res.status(400).send()
      }

      let event1 = await Event.findById({
        _id: id
      })

      if (sess.username === event1.creator) {
        if (event1.date !== req.body.date) {
          for (var i = 0, len = event1.notification_id.length; i < len; i++) {
            if (event1.notification_id[i] !== null) {
              deleteNotification(event1.notification_id[i])
            }
          }

          var EventDate = new Date(req.body.date)

          var NotiDate = new Date(EventDate.getTime() - 20000 * 60)

          var message = {
            app_id: 'd3d99984-794f-4c25-bedb-5cb810d8ed86',
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

    var options = {
      method: 'POST',
      url: `http://yashasingh.tech:8085/api/profiles/login/`,
      json: true,
      body: values
    }

    function callback (error, response, body) {
      if (!error && response.statusCode === 200) {
        sess = req.session
        sess.username = body.username
        var loginResp = _pick(body, ['username', 'first_name'])
        res.send(loginResp)
      } else {
        res.status(400).send()
      }
    }

    request(options, callback)
  })

  app.get('/logout', async (req, res) => {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err)
      } else {
        res.redirect('/')
      }
    })
  })

  app.get('/dashboard', (req, res) => {
    sess = req.session
    if (sess.username) {
      res.send('this is your dashboard')
    }
  })
}
