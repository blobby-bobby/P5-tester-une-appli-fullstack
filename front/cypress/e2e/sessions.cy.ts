describe('Sessions spec', () => {
  it('should list sessions when user is logged in', () => {
    // GIVEN
    cy.interceptIsAdmin(true);
    cy.interceptSessions();

    // WHEN
    cy.login('yoga@studio.com', 'test!1234');

    // THEN
    cy.url().should('include', '/sessions');
    cy.get('.item').should('have.length', 2);
  });

  it('should have create, edit and detail session buttons if user is admin', () => {
    // GIVEN
    cy.interceptIsAdmin(true);
    cy.interceptSessions();

    // WHEN
    cy.login('yoga@studio.com', 'test!1234');

    // THEN
    cy.url().should('include', '/sessions');
    cy.get('[data-testid="create-button"]').should('exist');
    cy.get('[data-testid="edit-button"]').should('exist');
    cy.get('[data-testid="detail-button"]').should('exist');
  });

  it('should not have create, edit and delete if user is not admin', () => {
    // GIVEN
    cy.interceptIsAdmin(false);
    cy.interceptSessions();

    // WHEN
    cy.login('yoga@studio.com', 'test!1234');

    // THEN
    cy.url().should('include', '/sessions');
    cy.get('[data-testid="create-button"]').should('not.exist');
    cy.get('[data-testid="edit-button"]').should('not.exist');
    cy.get('[data-testid="detail-button"]').should('exist');
  });
});
