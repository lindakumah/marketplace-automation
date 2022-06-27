import { loginData } from '../../fixtures/login.util'

const { individualLogin, invalidLogin } = loginData

describe('User Login', () => {
	beforeEach(() => {
		cy.visit('/')
		cy.visitLoginPage()
	})

	it('Individual logs in successfully', () => {
		cy.login(individualLogin.email, individualLogin.password)
	})

	// Failing - currently returning network error instead of the correct error message
	it('Login with invalid credentials', () => {
		cy.get('#email').type(invalidLogin.email)
		cy.get('#password').type(invalidLogin.password)
		cy.get('[data-testid=LoginIcon]').click()
		cy.contains('Invalid email and password')
	})

	it('Login without email and password', () => {
		cy.get('[data-testid=LoginIcon]').click()
		cy.contains('Email and Password fields are required')
	})

	it('Clicking forgot password link should navigate user to forgot password page', () => {
		cy.get('[href="/forgot-password"]')
			.click()
			.then(() => {
				cy.url().should('include', '/forgot-password')
			})
	})
})
