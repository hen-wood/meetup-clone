// set-postgres-parser.js

const { types } = require("pg");

function setPostgresParsers() {
	return (req, res, next) => {
		types.setTypeParser(701, val => parseFloat(val)); // parse decimal values as floats
		types.setTypeParser(20, val => parseInt(val, 10)); // parse bigInt values as integers
		next();
	};
}

module.exports = setPostgresParsers;
