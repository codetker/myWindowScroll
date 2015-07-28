module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                banner: '/*! <%= pkg.file %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },

            build: {
                src: 'src/jquery.codetker.windowScroll.js',
                dest: 'dest/jquery.codetker.windowScroll.min.js'
            }
        },

        jshint: ['src/jquery.codetker.windowScroll.js']

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'uglify']);

};