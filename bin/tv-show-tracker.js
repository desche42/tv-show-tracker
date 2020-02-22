#!/usr/bin/env node

/**
 * Entry point of the library
 */
const path = require('path');

// Set configuration file paths
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "../config");


const commander = require('commander');
const {version, description} = require(path.join(__dirname, '../package.json'));
const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');

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
	.command('watch', 'watch show', {executableFile: 'cli/watch'})
	.command('add', 'adds a show or a magnet to download', {executableFile: 'cli/add'})
	.command('track', 'track show', {executableFile: 'cli/track', isDefault: true})

/**
 * Parse arguments given
 */
program.parseAsync(process.argv);

