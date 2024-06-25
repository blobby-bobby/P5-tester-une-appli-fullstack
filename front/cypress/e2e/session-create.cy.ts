describe('Session create spec', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'Super Cool Session',
          date: '2024-05-29T00:00:00.000+00:00',
          teacher_id: 1,
          description: 'It is a Super Cool Session',
          users: [],
          createdAt: '2024-05-2917:03:24',
          updatedAt: '2024-05-2917:03:24',
        },
      ]
    ).as('session');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session/1',
      },
      [
        {
          id: 1,
          name: 'Super Cool Session',
          date: '2024-05-29T00:00:00.000+00:00',
          teacher_id: 1,
          description: 'It is a Super Cool Session',
          users: [1],
          createdAt: '2024-05-29T17:03:24',
          updatedAt: '2024-05-29T17:03:24',
        },
      ]
    ).as('session-detail');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/teacher',
      },
      [
        {
          id: 1,
          lastName: 'DELAHAYE',
          firstName: 'Margot',
          createdAt: '2024-05-29T17:03:24',
          updatedAt: '2024-05-29T17:03:24',
        },
      ]
    ).as('teacher');
  });

  it('should create session successfully when all fields are valid', () => {
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

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.get('[data-testid="create-button"]').should('exist');

    // WHEN
    cy.get('[data-testid="create-button"]').click();

    cy.get('input[formControlName=name]').type('New Super Cool Session');
    cy.get('[data-testid="submit-session"]').should('be.disabled');

    cy.get('input[formControlName=date]').type('2024-06-29');
    cy.get('[data-testid="submit-session"]').should('be.disabled');

    cy.get('mat-select[formControlName=teacher_id]')
      .click()
      .get('mat-option')
      .contains('DELAHAYE')
      .click();
    cy.get('[data-testid="submit-session"]').should('be.disabled');

    cy.get('textarea[formControlName=description]').type(
      'It is a new Super Cool Session'
    );

    cy.get('[data-testid="submit-session"]').should('not.be.disabled');
    cy.get('[data-testid="submit-session"]').click();

    // THEN
    cy.url().should('include', '/sessions');
  });

  it('should not have create session button if user is not admin', () => {
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

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.get('[data-testid="create-button"]').should('not.exist');
  });
});
