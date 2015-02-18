module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    expressrunner: {
      options: {
        script: 'index.js',
        debug: 'app*'
      }
    },
    env : {
      options : {
     //Shared Options Hash
     },
      dev : {
        src : "configs/dev.json"
      }
    }
  });



  grunt.loadNpmTasks('grunt-express-runner');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('dev', ['env:dev', 'expressrunner']);
}
