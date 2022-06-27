export const registrationData = () => {
	return {
		email:
			'new-tester' +
			new Date().getTime().toString().slice(8, 10) +
			'@o1c0tuzx.mailosaur.net',
		password: 'AwesomeTester@123',
		conPassword: 'AwesomeTester@123',
	}
}

export const serverId = 'o1c0tuzx'
