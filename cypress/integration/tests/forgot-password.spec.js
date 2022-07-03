import { serverId } from '../../fixtures/signup.util'
import { loginData } from '../../fixtures/login.util'

const { individualLogin } = loginData
const forgotPasswordEmail = 'new-tester28@o1c0tuzx.mailosaur.net'
let verificationCode

describe('Forgot Password', () => {
	before(() => {
		cy.visitLoginPage()
	})

	beforeEach(() => {
		cy.intercept('POST', 'https://**/api/auth/keyinput/').as('resetCode')
	})

	it('Reset user password', () => {
		cy.get('a[href="/forgot-password"]').click()
		cy.url().should('contain', '/forgot-password')

		cy.intercept('POST', 'https://**/api/auth/create-key/').as('resetPassword')
		cy.get('#reset_password').type(forgotPasswordEmail)
		cy.get('button[type="submit"]').contains('Reset Password').click()
		cy.wait('@resetPassword').then((res) => {
			expect(res.response.body.detail).to.equal('Reset Code Sent Successfully')
		})

		// get confirmation code
		cy.mailosaurGetMessage(serverId, {
			sentTo: forgotPasswordEmail,
		}).then((emailReceived) => {
			expect(emailReceived.subject).to.equal('Password forgotten')
			verificationCode = emailReceived.text.codes[0].value
			cy.get('.forgotPasswordFormInput').type(Number(verificationCode))
			cy.get('button[type="submit"]').contains('Submit').click()
		})
		cy.wait('@resetCode')

		// Enter and submit new password
		cy.get('input[type="password"]').first().type(individualLogin.password)
		cy.get('input[type="password"]').eq(1).type(individualLogin.password)
		cy.get('button[type="submit"]').contains('Reset').click()
	})
})
