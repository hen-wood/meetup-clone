// backend/config/database.js
const config = require("./index");

module.exports = {
	development: {
		storage: config.dbFile,
		dialect: "sqlite",
		seederStorage: "sequelize",
		logQueryParameters: true,
		typeValidation: true
	},
	production: {
		use_env_variable: "DATABASE_URL",
		dialect: "postgres",
		seederStorage: "sequelize",
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false
			},
			types: {
				setTypeParser: (id, parser) => {
					if (id === 701) {
						// decimal type
						return val => parseFloat(val); // parse decimal values as floats
					}
					if (id === 20) {
						// int8
						return val => parseInt(val, 10); // parse bigInt values as floats
					}
					return parser(val);
				}
			}
		},
		define: {
			schema: process.env.SCHEMA
		}
	}
};
