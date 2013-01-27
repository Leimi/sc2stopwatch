module.exports = function(grunt) {
  // Your grunt code goes in here.
  grunt.initConfig({
  	concat: {
  		'scripts.js': ['jquery.js', 'jquery.fittext.js', 'underscore.js', 'backbone.js', 'backbone.localStorage.js', 'script.js']
  	},
  	min: {
  		'scripts.min.js':'scripts.js'
  	}
  })
};