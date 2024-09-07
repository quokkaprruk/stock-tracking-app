/// <reference types="cypress"/>

describe("Accessing stocks", () => {
  let url = Cypress.env("website_url");
  beforeEach(() => {
    console.log(url)
    cy.visit(url);
  });
  it("Can search for a stock", () => {
    cy.get("#default-search").type("AAPL{enter}")
  });

  it("Can handle search for non existant stocks", () => {
    cy.get("#default-search").type("fakestock{enter}")
    cy.get("#error").should('be.visible')
  })
});
