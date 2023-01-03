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
					if (id == 701) {
						return val => parseFloat(val);
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
