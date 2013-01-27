var Timer = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage("Timer"),
	defaults: {
		"secs": 00,
		"playing": false,
		"date": Math.round(new Date().getTime())
	},
	interval: null,
	initialize: function(options) {
		this.fetch();
		if (this.isPlaying()) {
			var now = Math.round(new Date().getTime()),
				diff = (now - this.get('date'))/725;
			this.set('secs', this.get('secs')+Math.round(diff));
			this.start();
		}
	},
	start: function() {
		var _this = this;
		this.interval = setInterval(function() {
			_this.set("secs", _this.get("secs")*1+1);
			_this.set("date", Math.round(new Date().getTime()));
			_this.save();
		}, 725);
		this.set('playing', true);
	},
	stop: function() {
		clearInterval(this.interval);
		this.interval = null;
		this.set('playing', false);
		this.save();
	},
	reset: function() {
		this.stop();
		this.set("secs", 0);
		this.save();
	},
	isPlaying: function() {
		return this.get('playing');
	},
	getHours: function() {
		var hours = Math.floor(this.get('secs')/3600);
		return hours <= 9 ? "0" + hours : hours;
	},
	getMins: function() {
		var mins =  Math.floor((this.get('secs') % 3600)/60);
		return mins <= 9 ? "0" + mins : mins;
	},
	getSecs: function() {
		var secs = this.get('secs') % 60;
		return secs <= 9 ? "0" + secs : secs;
	},
	toJSON: function() {
		return { hours: this.getHours(), minutes: this.getMins(), seconds: this.getSecs(), playing: this.get('playing'), date: this.get('date'), secs: this.get('secs') };
	}
});

var TimerView = Backbone.View.extend({
	initialize: function() {
		this.model.bind('all', this.render, this);
		this.model.bind('change:playing', this.updatePlayingStatus, this);
		this.render();
		this.updatePlayingStatus();
		this.$el.find('#timer').fitText(0.65);
	},

	template: _.template($('#timer-template').html()),

	events: {
		"click #start-stop": "startStop",
		"click #reset": "reset"
	},

	render: function() {
		var time = this.model.toJSON();
		this.$el.find('#timer').html(this.template(time));
	},

	startStop: function() {
		if (this.model.isPlaying()) {
			this.model.stop();
		} else {
			this.model.start();
		}
	},

	reset: function() {
		this.model.reset();
	},

	updatePlayingStatus: function() {
		var button = this.$el.find('#start-stop');
		if (this.model.isPlaying()) {
			button.text('Stop');
		} else {
			button.text('Start');
		}
	}
});
var timer = new Timer({ id: "poil" });
var app = new TimerView({
	model: timer,
	el: '#container'
});