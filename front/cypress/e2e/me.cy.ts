describe('Me spec', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'JohnnyBravo',
        firstName: 'Johnny',
        lastName: 'Bravo',
        admin: true,
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/user/1',
      },
      {
        id: 1,
        email: 'yoga@studio.com',
        username: 'JohnnyBravo',
        firstName: 'Johnny',
        lastName: 'Bravo',
        admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ).as('me-details');

    cy.login('yoga@studio.com', 'test!1234');

    cy.get('[data-testid="me-link"]').click();
  });

  afterEach(() => {
    cy.intercept('POST', '/api/auth/logout').as('logout');
  });

  it('should show user information, as non admin', () => {
    cy.get('.mat-card-title').should('contain', 'User information');
    cy.get('[data-testid="user-name"]').should('contain', 'Johnny BRAVO');
    cy.get('[data-testid="user-email"]').should('contain', 'yoga@studio.com');
    cy.get('[data-testid="isAdmin"]').should('not.exist');
    cy.get('[data-testid="delete-account-button"]').should('exist');
  });

  it('should delete user account on click on delete', () => {
    cy.intercept('DELETE', '/api/user/1', { statusCode: 200 });

    cy.get('[data-testid="delete-account-button"]').should('exist');
    cy.get('[data-testid="delete-account-button"]').click();

    cy.url().should('not.contain', 'me');
  });
});
