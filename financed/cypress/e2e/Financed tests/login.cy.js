/// <reference types="cypress" />

describe("Logging in", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

  it("Has 3 inputs", () => {
    cy.get("input").should("have.length", 3);
  });

  it("Can login", () => {
    cy.get("#username").type("jashan");
    cy.get("#password").type("something");
    cy.get("#submit").click();
  });

  it("Fails login with incorrect passowrd", () => {
    cy.get("#error-message").should("not.exist")
    cy.get("#username").type("jashan");
    cy.get("#password").type("wrongpassword");
    cy.get("#submit").click();
    cy.get("#error-message").should("be.visible");
  });
});
