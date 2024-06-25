describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully, with correct credentials', () => {
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

    cy.get('.error').should('not.exist');
    cy.url().should('include', '/sessions');
  });

  it('should not login, with incorrect password', () => {
    cy.intercept('POST', '/api/auth/login', { statusCode: 400 });

    cy.login('yoga@studio.com', 'test!1234');

    cy.url().should('include', '/login');
    cy.get('.error').should('be.visible');
  });

  it('should not login, with incorrect email', () => {
    cy.intercept('POST', '/api/auth/login', { statusCode: 400 });

    cy.login('yoga@studio.com', 'test!1234');

    cy.url().should('include', '/login');
    cy.get('.error').should('be.visible');
  });

  it('should have disabled submit button while all fields are invalid', () => {
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[formControlName=email]').type('yoga@');
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[formControlName=email]').clear();
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[formControlName=password]').type('test');
    cy.get('button[type=submit]').should('be.disabled');
  });
});
