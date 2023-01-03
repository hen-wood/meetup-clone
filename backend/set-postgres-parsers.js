const { types } = require("pg");

function setPostgresParsers() {
	// change default Postgres settings to return decimals as floats instead of strings
	types.setTypeParser(701, val => parseFloat(val));
	// change default Postgres settings to return aggregate data as integers instead of strings
	types.setTypeParser(20, val => parseInt(val, 10));
}

module.exports = setPostgresParsers;
