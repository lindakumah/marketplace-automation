import { loginData } from '../../fixtures/login.util'
import { productData, editProductData } from '../../fixtures/add-product.util'

const { organizationLogin } = loginData
const { name, price, discount, description } = productData
const { newName, newPrice, newDiscount, newDescription } = editProductData

describe('Add Product', () => {
	before(() => {
		cy.clearCookies()
		cy.clearLocalStorage()
	})

	beforeEach(() => {
		cy.login(organizationLogin.email, organizationLogin.password)
		cy.visit('/')
	})

	it('Verify that business has no product yet', () => {
		cy.gotoPostedProductsPage()
		cy.contains('Sorry, there are no items that match your search')
	})

	it('Add product', () => {
		cy.get('.add-product-button')
			.click()
			.then(() => {
				cy.url().should('contain', '/add-product')
			})

		cy.get('input[type=file]').selectFile(
			[
				'cypress/fixtures/images/perfume.jpg',
				'cypress/fixtures/images/perfume1.jpg',
				'cypress/fixtures/images/perfume2.jpg',
			],
			{ force: true }
		)
		cy.get('.product-name-input').type(name)
		cy.get('.product-price-input').type(price)
		cy.get('#demo-simple-select')
			.first()
			.click()
			.then(() => {
				cy.get('[data-value="FTF"]').click()
			})
		cy.get('.product-discount-input').type(discount)
		cy.get('.add-product-type')
			.click()
			.then(() => {
				cy.get('[data-value="PR"]').click()
			})
		cy.get('[class*=product-description]').eq(1).type(description)

		cy.get('.add-product-button').eq(1).click()
		cy.url().should('contain', '/posted-products')
	})

	it('Edit added product', () => {
		cy.gotoPostedProductsPage()
		cy.get('[data-testid=EditIcon]').click()
		cy.url().should('contain', '/edit-product')

		cy.get('.product-name-input').clear().type(newName)
		cy.get('.product-price-input').clear().type(newPrice)
		cy.get('.product-discount-input').clear().type(newDiscount)
		cy.get('[class*=product-description]').eq(1).clear().type(newDescription)
		cy.get('.add-product-button')
			.contains('Edit Product')
			.click()
			.then(() => {
				cy.url().should('contain', '/posted-product')
			})
	})

	it('Delete added product', () => {
		cy.gotoPostedProductsPage()
		cy.get('[data-testid=DeleteIcon]').click()
		cy.get('button')
			.contains('Yes')
			.click()
			.then(() => {
				cy.contains('Sorry, there are no items that match your search')
			})
	})
})
