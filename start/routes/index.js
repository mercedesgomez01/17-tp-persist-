var Promise = require('bluebird');
var router = require('express').Router();

var db = require('../models');//automatically points to index.js 
var Hotel = db.Hotel

// module.exports = {
// 	db: db,
// 	Day: Day,
// 	Hotel: Hotel,
// 	Restaurant: Restaurant,
// 	Activity: Activity,
// 	Place: Place
// }
var Restaurant = db.Restaurant;
var Activity = db.Activity;
var Place = db.Place;
var Day = db.Day; //this does not link us to the model :(

router.get('/', function(req, res, next) {
	Promise.all([
		Hotel.findAll({ include: [Place] }),
		Restaurant.findAll({ include: [Place] }),
		Activity.findAll({ include: [Place] })
	])
	.spread(function(hotels, restaurants, activities) {
		res.render('index', {
			hotels: hotels,
			restaurants: restaurants,
			activities: activities
		})
	})
	.catch(next)
})

// Example:
//
// Use Fetch (built in browser API):
//
//   fetch('/api').then(res => json()).then(doSomethingWithIt)
//
// Use jQuery's $.get:
//
//   $.get('/api').then(doSomethingWithIt)
//
// Or:
//
//   $.ajax('/api', {method: 'get'}).then(doSomethingWithIt)
//
router.get('/api', (req, res, next) =>
	Promise.props({
		hotels: Hotel.findAll({ include: [Place] }),
		restaurants: Restaurant.findAll({ include: [Place] }),
		activities: Activity.findAll({ include: [Place] })
	})
		.then(data => res.json(data))
		.catch(next)
)

router.get('/api/hotels', (req, res, next) =>
	Promise.props({
		hotels: Hotel.findAll({ include: [Place] })
	})
		.then(data => {
			res.send(data.hotels);})
		.catch(next)
)

router.get('/api/restaurants', (req, res, next) =>
	Promise.props({
		restaurants: Restaurant.findAll({ include: [Place] }),
	})
		.then(data => {
			res.send(data.restaurants);})
		.catch(next)
)

router.get('/api/activities', (req, res, next) =>
	Promise.props({
		activities: Activity.findAll({ include: [Place] })
	})
		.then(data => {
			console.log(data); 
			res.send(data.activities);})
		.catch(next)
)

// GET /api/days -- list of all the days
router.get('/api/days', function (req, res, next) {
	Day.findAll()
		.then(function(days){
			res.json(days)
		})
		.catch(next)
})

// GET /api/days/:id -- get one specific days
router.get('/api/days/:id', function(req, res, next) {
	Day.findOne({where: {id: req.params.id}})
		.then(function(day){console.log(day)})
		.catch(next);
})

// DELETE /api/days/:id -- delete one specific day
router.delete('/api/days/:id', function(req, res, next) {
	Day.findAll()
	.then(function(days){
		return Day.destroy({
			where: {
				id: req.params.id
			},
			// truncate: true
		});
	})
	.then(function(numOfDeletedDays){
		console.log('You have deleted ' + numOfDeletedDays + ' days');
	})
	.catch(next);
})

// POST /api/days/number -- create a new day
router.post('/api/days/:number', function(req, res, next) {
	Day.create({
		number: req.params.number
	})
	.then(data => {
			res.send(data);})
	// .then(function(newDay){
	// 	console.log(newDay);
	// })
	// .catch(next);
})

// POST /api/days/:id/:attraction_type -- add an attraction to a specific day
//api/days/2/restaurants
router.post('/api/days/:id/:attraction_type', function(req, res, next) {
	Day.findById(req.params.id)
	//Day.findOne({where: {id: req.params.id}})
	.then(function(day){
		if (req.params.attraction_type==='restaurants'){
			console.log('tada!')
			day.addRestaurant(2)//lets return to this and make 2 the button information related to the button being pushed
		 }
		//else if (){

		// }else{
		// 	addingTo = day.setHotel
		// }
		// tie day to specific attraction, which is given in the req.body?
		// day.addActivity
		// day.addRestaurant

	})
})

// WIKISTACK EXAMPLE
// router.post(‘/‘, function (req, res, next) {
// 	User.findOrCreate({
// 		where: { 
// 			email: req.body.authorEmail,
// 			name: req.body.authorName
// 		}
// 	})
// 	.spread(function(user, wasCreatedBoolean) { 
// 		Page.create({
// 			title: req.body.title,
// 			content: req.body.content,
// 			status: req.body.status
// 		})
// 		.then(function (createdPage) {
// 			return createdPage.setAuthor(user) // updates the database
// 		})
// 	})
// 	.then(function (createdPage) {
// 		res.redirect(createdPage.route);
// 	})
// 	.catch(next);

// DELETE /api/days/:id/:attraction_type -- delete an attraction from a specific day




// /
// Use Fetch (built in browser API):
//
//   IDK, look it up on MDN?
//
// Use jQuery's $.post:
//
//   $.post('/api/echo', {hello: 'world'}).then(doSomethingWithIt)
router.post('/api/echo', (req, res) => res.json(req.body))

router.post('/api/hotels',
	(req, res, next) =>
		Hotel.create(req.body)
			.then(hotel => res.json(hotel))
			.catch(next))

module.exports = router;
