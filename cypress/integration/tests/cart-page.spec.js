import { loginData } from '../../fixtures/login.util'
import { cartIconId } from './_helpers/cart'

const { individualLogin } = loginData

describe('Cart Page', () => {
	before(() => {
		cy.clearCookies()
		cy.clearLocalStorage()
	})

	beforeEach(() => {
		cy.login(individualLogin.email, individualLogin.password)
		cy.visit('/')
		cy.intercept(
			'POST',
			'https://**/api/marketplace/shopping-cart/add-item'
		).as('addItem')
		cy.intercept(
			'DELETE',
			'https://**/api/marketplace/shopping-cart/remove-item/**'
		).as('removeItem')
		cy.intercept(
			'GET',
			'https://**/api/marketplace/shopping-cart/get_count'
		).as('itemsInCart')
	})

	after(() => {
		cy.clearCookies()
		cy.clearLocalStorage()
	})

	it('Add item to cart', () => {
		cy.get(cartIconId).as('cartIcon')
		cy.get('@cartIcon').eq(1).click()
		cy.wait('@addItem')
	})

	it('Go to cart page and remove item from cart', () => {
		cy.get(cartIconId)
			.eq(0)
			.click()
			.then(() => {
				cy.url().should('include', '/cart')
			})
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
