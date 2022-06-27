import { registrationData, serverId } from '../../fixtures/signup.util'

const { email, password, conPassword } = registrationData()

describe('Signup', () => {
	before(() => {
		cy.visit('/')
		cy.visitLoginPage()
	})

	it('Clicks on signup tab', () => {
		cy.contains('Sign up')
			.click()
			.then(() => {
				cy.get('button').eq(2).should('have.class', 'active')
			})
	})

	it('Enter sign up details', () => {
		cy.get('#email').type(email)
		cy.get('#Password').type(password)
		cy.get('[id*=Confirm]').type(password)
	})

	it('Verify that individual radio is selected', () => {
		cy.get('[class*=PrivateSwitchBase]').eq(3).should('be.checked')
	})

	it('Click on register button', () => {
		cy.intercept('POST', 'https://**/api/auth/registration/').as('signup')
		cy.get('.signup-btn-register').click()
		cy.wait('@signup')
	})

	it('Click confirm button', () => {
		cy.get('button').contains('Confirm').click({ force: true })
		cy.url().should('contain', `/confirm-account/${email}`)
	})

	it('Enter verification code', () => {
		cy.intercept('POST', 'https://**/api/auth/keyinput/').as('confirmAccount')
		cy.mailosaurGetMessage(serverId, {
			sentTo: email,
		}).then((emailReceived) => {
			expect(emailReceived.subject).to.equal('Account activation')
			const emailVerificationCode = emailReceived.text.codes[0]
			cy.get('.confirm-input-wrapper')
				.children()
				.first()
				.type(emailVerificationCode.value)
		})
		cy.get('.confirm-button')
			.click()
			.then(() => {
				cy.wait('@confirmAccount')
			})

		cy.url().should('contain', '/login')
	})

	it('Login with new account', () => {
		cy.login(email, password)
	})
})
