/**
 * Common functions
 */
const inquirer = require('inquirer');
const chalk = require('chalk');


async function confirmAction (message, color = 'green') {
	const {confirm} = await inquirer.prompt([{
		name: 'confirm',
		type: 'confirm',
		message: chalk[color](message)
	}]);

	return !!confirm;
}



module.exports = {
	confirmAction
}
