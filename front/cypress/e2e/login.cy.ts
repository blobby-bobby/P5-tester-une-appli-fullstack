describe('Login spec', () => {
  it('should login successfully, with correct credentials', () => {
    // GIVEN
    cy.interceptIsAdmin(true);

    // WHEN
    cy.login('yoga@studio.com', 'test!1234');

    // THEN
    cy.get('.error').should('not.exist');
    cy.url().should('include', '/sessions');
  });

  it('should not login, with incorrect password', () => {
    // GIVEN
    cy.intercept('POST', '/api/auth/login', { statusCode: 400 });

    // WHEN
    cy.login('yoga@studio.com', 'wrong_password');

    // THEN
    cy.url().should('include', '/login');
    cy.get('.error').should('be.visible');
  });

  it('should not login, with incorrect email', () => {
    // GIVEN
    cy.intercept('POST', '/api/auth/login', { statusCode: 400 });

    // WHEN
    cy.login('wrong@email.com', 'test!1234');

    // THEN
    cy.url().should('include', '/login');
    cy.get('.error').should('be.visible');
  });

  it('should have disabled submit button while all fields are invalid', () => {
    // WHEN
    cy.visit('/login');

    // THEN
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[formControlName=email]').type('yoga@');
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[formControlName=email]').clear();
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[formControlName=password]').type('test');
    cy.get('button[type=submit]').should('be.disabled');
  });
});
