describe('Sessions spec', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should list sessions when user is logged in', () => {
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

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'Super Cool Session',
          date: new Date(),
          teacher_id: 1,
          description: 'It is a Super Cool Session',
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Another Super Cool Session',
          date: new Date(),
          teacher_id: 1,
          description: 'It another Super Cool Session',
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    ).as('session');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.get('.error').should('not.exist');
    cy.url().should('include', '/sessions');

    // THEN
    cy.get('.item').should('have.length', 2);
  });

  it('should have create, edit and detail session buttons if user is admin', () => {
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

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'Super Cool Session',
          date: new Date(),
          teacher_id: 1,
          description: 'It is a Super Cool Session',
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Another Super Cool Session',
          date: new Date(),
          teacher_id: 1,
          description: 'It another Super Cool Session',
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    ).as('session');

    // WHEN
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.get('.error').should('not.exist');
    cy.url().should('include', '/sessions');

    // THEN
    cy.get('[data-testid="create-button"]').should('exist');
    cy.get('[data-testid="edit-button"]').should('exist');
    cy.get('[data-testid="detail-button"]').should('exist');
  });

  it('should not have create, edit and delete if user is not admin', () => {
    // GIVEN
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'JohnnyBravo',
        firstName: 'Johnny',
        lastName: 'Bravo',
        admin: false,
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'Super Cool Session',
          date: new Date(),
          teacher_id: 1,
          description: 'It is a Super Cool Session',
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Another Super Cool Session',
          date: new Date(),
          teacher_id: 1,
          description: 'It another Super Cool Session',
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    ).as('session');

    // WHEN
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.get('.error').should('not.exist');
    cy.url().should('include', '/sessions');

    // THEN
    cy.get('[data-testid="create-button"]').should('not.exist');
    cy.get('[data-testid="edit-button"]').should('not.exist');
    cy.get('[data-testid="detail-button"]').should('exist');
  });
});
