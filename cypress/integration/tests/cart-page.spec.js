import { loginData } from '../../fixtures/login.util'
import { cartIconId } from './_helpers/cart'

const { individualLogin } = loginData

describe('Cart Page', () => {
	before(() => {
		cy.clearCookies()
		cy.visitLoginPage()
		cy.login(individualLogin.email, individualLogin.password)
	})

	beforeEach(() => {
		cy.intercept(
			'PUT',
			'https://**/api/marketplace/shopping-cart/update/**'
		).as('addItem')
		cy.intercept(
			'DELETE',
			'https://**/api/marketplace/shopping-cart/remove-item/**'
		).as('removeItem')
	})

	after(() => {
		cy.clearCookies()
		cy.clearLocalStorage()
	})

	it('Add item to cart', () => {
		cy.get(cartIconId).as('cartIcon')
		cy.get('@cartIcon').eq(1).click().wait('@addItem')
	})

	it('Go to cart page', () => {
		cy.get(cartIconId)
			.eq(0)
			.click()
			.then(() => {
				cy.url().should('include', '/cart')
			})
	})

	it('Remove item from cart', () => {
		cy.intercept(
			'GET',
			'https://**/api/marketplace/shopping-cart/get_count'
		).as('itemsInCart')
		cy.get('[data-testid=DeleteIcon]').click()
		cy.get('button')
			.contains('Delete')
			.click({ force: true })
			.wait('@removeItem')
			.wait('@itemsInCart')
			.then((res) => {
				if (res.statusCode === 200) {
					expect(res.response.data).to.equal(0)
				}
				console.log({ res })
			})
		cy.get('.no-item').should('be.visible')
	})
})
