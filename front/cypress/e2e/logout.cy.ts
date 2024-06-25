describe('Logout spec', () => {
  it('should logout successfully', () => {
    // GIVEN
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'JohnnyBravo',
        firstName: 'Johnny',
        lastName: 'Bravo',
        admin: true,
      },
    });

    cy.login('yoga@studio.com', 'test!1234');
    cy.url().should('include', '/sessions');

    // WHEN
    cy.get('span[data-testid="logout-link"]').click();

    // THEN
    cy.url().should('not.include', '/session');
  });
});
