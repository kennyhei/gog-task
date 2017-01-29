module.exports = function (grunt) {

    /* Task configuration */
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        uglify: {

            dist: {

                src: ['app/app.js',
                      'app/js/controllers/*.js',
                      'app/js/services/*.js'],
                dest: 'app/app.min.js'
            },

            options: {
                mangle: false
            }
        },

        endline: {

            dist: {

                src: ['Gruntfile.js', 'package.json', 'app/js/*.js', 'app/**/*.html']
            },

            options: {
                replaced: true
            }
        }
    });

    /* Load tasks */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-endline');

    /* Register tasks */
    grunt.registerTask('default', ['uglify', 'endline']);
}

