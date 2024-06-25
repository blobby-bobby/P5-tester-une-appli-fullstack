describe('Register spec', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should register successfully, with correct credentials', () => {
    cy.intercept('POST', '/api/auth/register', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.get('input[formControlName=firstName]').type('Johnny');
    cy.get('input[formControlName=lastName]').type('Bravo');
    cy.get('input[formControlName=email]').type('johnny@bravo.com');
    cy.get('input[formControlName=password]').type(
      `${'johnny!1234'}{enter}{enter}`
    );

    cy.get('.error').should('not.exist');
    cy.url().should('include', '/login');
  });

  it('should have disabled submit button, with missing credentials', () => {
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[formControlName=firstName]').type('Johnny');
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[formControlName=lastName]').type('Bravo');
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[formControlName=email]').type('johnny@bravo.com');
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[formControlName=password]').type(
      `${'johnny!1234'}{enter}{enter}`
    );
    cy.get('button[type=submit]').should('not.be.disabled');

    cy.get('input[formControlName=password]').clear();
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('.error').should('exist');
  });
});
