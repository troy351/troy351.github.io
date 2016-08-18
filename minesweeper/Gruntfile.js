module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    'js/build/engine.js': 'js/src/engine.js',
                    'js/build/block.js': 'js/src/block.js',
                    'js/build/sound.js': 'js/src/sound.js'
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
                options: {
                    mangle: false, //不混淆变量名
                    preserveComments: 'all', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                },
                files: {
                    'js/build/engine.min.js': ['js/build/engine.js'],
                    'js/build/block.min.js': ['js/build/block.js'],
                    'js/build/sound.min.js': ['js/build/sound.js']
                }
            }
        }
    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['babel', 'uglify']);
};