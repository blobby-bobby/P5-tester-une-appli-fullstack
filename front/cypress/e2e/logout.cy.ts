describe('Logout spec', () => {
  it('should logout successfully', () => {
    // GIVEN
    cy.interceptIsAdmin(true);

    cy.login('yoga@studio.com', 'test!1234');
    cy.url().should('include', '/sessions');

    // WHEN
    cy.get('span[data-testid="logout-link"]').click();

    // THEN
    cy.url().should('not.include', '/session');
  });
});
