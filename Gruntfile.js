module.exports = function (grunt) {

    /* Task configuration */
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        uglify: {

            dist: {

                src: ['app/app.js',
                      'app/js/**/*.js'],
                dest: 'app/app.min.js'
            },

            options: {
                mangle: false
            }
        }
    });

    /* Load tasks */
    grunt.loadNpmTasks('grunt-contrib-uglify');

    /* Register tasks */
    grunt.registerTask('default', ['uglify']);
}

