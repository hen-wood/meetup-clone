const notFound = msg => {
	const err = new Error(msg);
	err.status = 404;
	return err;
};

module.exports = {
	notFound
};
