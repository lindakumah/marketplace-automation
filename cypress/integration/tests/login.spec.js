import { loginData } from '../../fixtures/login.util'

const { individualLogin, invalidLogin } = loginData

describe('User Login', () => {
	beforeEach(() => {
		cy.visit('/')
	})

	it('Individual logs in successfully', () => {
		cy.login(individualLogin.email, individualLogin.password)
	})

	it('Login with invalid credentials', () => {
		cy.login(invalidLogin.email, invalidLogin.password)
		cy.get('.snackbarContainer')
			.eq(1)
			.should('contain', 'Invalid email and password')
	})

	it('Login without email and password', () => {
		cy.get('[data-testid=LoginIcon]')
			.click()
			.then(() => {
				cy.get('.snackbarContainer')
					.eq(1)
					.should('be.visible')
					.and('contain', 'Email and Password fields are required')
			})
	})

	it('Clicking forgot password link should navigate user to forgot password page', () => {
		cy.get('[href="/forgot-password"]')
			.click()
			.then(() => {
				cy.url().should('include', '/forgot-password')
			})
	})
})
