// set-postgres-parser.js

const { types } = require("pg");

function setPostgresParsers() {
	return (req, res, next) => {
		types.setTypeParser(20, val => parseInt(val, 10)); // parse bigInt values as integers
		next();
	};
}

module.exports = setPostgresParsers;
