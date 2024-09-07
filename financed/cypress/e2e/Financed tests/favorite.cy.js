/// <reference types="cypress"/>


describe("Favorite functionality", () => {
    let url = Cypress.env("website_url")
    beforeEach(()=>{
        cy.visit(`${url}/login`)
        cy.get('#username').type('testuser')
        cy.get('#password').type('testpassword')
        cy.get('#submit').click();
        cy.url().should('eq',`${url}/`)
    })

    it("Can add a favorite", ()=>{
        cy.visit(`${url}/stock/AAPL`)
        cy.get('#add_favorite').click()
        cy.visit(`${url}/favourites`)
        cy.get('#AAPL').should('exist')
    })

    it("Can remove a favorite", () => {
        cy.visit(`${url}/favourites`)
        cy.get('#AAPL #remove').click()
        cy.get('#tbody tr').should('have.length', 0)
    })
})