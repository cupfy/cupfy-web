var errors = [
	{ code: 1,
		description: 'User not found.' },
	{ code: 2,
		description: 'Please check the fields.' },
	{ code: 3,
		description: 'Email address already exists.' },
	{ code: 10,
		description: 'Device not found.' },
	{ code: 13,
		description: 'Device already registered.' },
	{ code: 100,
		description: 'Authentication failed.' },
	{ code: 999,
		description: 'Something went very wrong.' }
];

exports.getErrors = function()
{
	return errors;
}

exports.getError = function(err)
{
	for(var i in errors)
	{
		if(errors[i].code == err)
		{
			return errors[i];
		}
	}

	return { code: 999, description: 'Undefined error' };
}
