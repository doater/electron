'use strict'
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        version: grunt.template.today("mmddHHMM"),
        transport: {
            options: {
                paths: ['dist/web/modules'],
                alias: {
                    'config': 'config',
                    'Handlebars': 'Handlebars',
                    'util': 'util',
                    "accountUtil": 'accountUtil',
                    'i18n': 'i18n',
                    'helper': 'helper'
                },
                debug: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/web/modules',
                    src: ['**/*.js', '**/*.tpl', '**/**/*.js', '**/**/*.tpl'],
                    dest: 'dist/web/modules',
                    filter: function(path) {
                        path = path.replace(/\\/g, '/');
                        if (path.indexOf('/textview') > -1) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }]
            }
        },
        concat: {
            'index': {
                src: ['dist/web/modules/index/**/*.js', 'dist/web/modules/view/**/*.js', 'dist/web/modules/base/**/*.js'],
                dest: 'dist/web/tmp/modules/index/main.js'
            },
            'admin': {
                src: ['dist/web/modules/admin/**/*.js', 'dist/web/modules/base/**/*.js'],
                dest: 'dist/web/tmp/modules/admin/main.js'
            },
            'console': {
                src: ['dist/web/modules/console/**/*.js', 'dist/web/modules/index/fscore.js', 'dist/web/modules/view/**/*.js', 'dist/web/modules/base/**/*.js'],
                dest: 'dist/web/tmp/modules/console/main.js'
            },
            'login': {
                src: ['dist/web/modules/login/**/*.js'],
                dest: 'dist/web/tmp/modules/login/main.js'
            },
            'share': {
                src: ['dist/web/modules/share/**/*.js', 'dist/web/modules/view/**/*.js', 'dist/web/modules/base/**/*.js', 'dist/web/modules/index/fscore.js'],
                dest: 'dist/web/tmp/modules/share/main.js'
            },
            'dsoview': {
                src: ['dist/web/modules/page/dsoview.js', 'dist/web/modules/index/fscore.js'],
                dest: 'dist/web/tmp/modules/page/dsoview.js'
            },
            'sharelink': {
                src: ['dist/web/modules/iframe/sharelink/*.js', 'dist/web/modules/iframe/sharelink.js'],
                dest: 'dist/web/tmp/modules/iframe/sharelink.js'
            },
            'msg': {
                src: ['dist/web/modules/iframe/msg/*.js', 'dist/web/modules/iframe/msg.js', 'dist/web/modules/index/fscore/*.js', 'dist/web/modules/index/fscore.js'],
                dest: 'dist/web/tmp/modules/iframe/msg.js'
            },
            'saas_console': {
                src: ['dist/web/modules/saas_console/**/*.js', 'dist/web/modules/base/**/*.js'],
                dest: 'dist/web/tmp/modules/saas_console/main.js'
            },
        },
        'imagemagick-convert': {
            dist: {
                args: ['dist/web/statics/images/icons-<%= version %>.png', 'dist/web/statics/images/icons-<%= version %>.gif']
            }
        }
    });
}
