module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015'],
                plugins: ['transform-es2015-modules-amd']
            },
            dist: {
                files: {
                    'js/engine.js': 'js/src/engine.js',
                    'js/block.js': 'js/src/block.js'
                }
            }
        },
        watch: {
            scripts: {
                options: {
                    debounceDelay: 250,
                    spawn: false
                },
                files: ['js/src/*.js'],
                tasks: ['babel', 'uglify']
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n'
            },
            build: {
                files: {
                    'js/engine.min.js': ['js/engine.js'],
                    'js/block.min.js': ['js/block.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['uglify']);
};