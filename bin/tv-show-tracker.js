#!/usr/bin/env node

/**
 * Entry point of the library
 */
const commander = require('commander');
const {version, description} = require('../package.json');
const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');

// default option
const app = require('..');

/**
 * Print title
 */
clear();
console.log(chalk.red(
	figlet.textSync('Tv Show Tracker', {horizontalLayout: 'full'})
));

const program = new commander.Command();

program
	.version(version)
	.description(description)
	.command('watch', 'watch show', {executableFile: 'watch'})
	.command('track', 'track show', {executableFile: 'track', isDefault: true})



// /**
//  * Parse arguments given
//  */
program.parseAsync(process.argv);
