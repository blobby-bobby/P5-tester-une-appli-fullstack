describe('Session detail spec', () => {
  it('should show session infos on click on detail button as admin', () => {
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
      {
        id: 1,
        name: 'Super Cool Session',
        date: '2024-05-29T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'It is a Super Cool Session',
        users: [1],
        createdAt: '2024-05-29T17:03:24',
        updatedAt: '2024-05-29T17:03:24',
      }
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

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // WHEN
    cy.get('[data-testid="detail-button"]').click();
    cy.url().should('include', '/sessions/detail/1');

    // THEN
    cy.get('.mat-card-title').contains('Super Cool Session');
    cy.get('.description').contains('It is a Super Cool Session');
    cy.get('[data-testid="number-of-attendees"]').contains('1 attendees');
    cy.get('[data-testid="delete-button"]').should('exist');
  });

  it('should not have delete button on session detail as non admin', () => {
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
      {
        id: 1,
        name: 'Super Cool Session',
        date: '2024-05-29T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'It is a Super Cool Session',
        users: [1],
        createdAt: '2024-05-29T17:03:24',
        updatedAt: '2024-05-29T17:03:24',
      }
    ).as('session-detail');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/teacher/1',
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

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // WHEN
    cy.get('[data-testid="detail-button"]').click();
    cy.url().should('include', '/sessions/detail/1');

    // THEN
    cy.get('.mat-card-title').contains('Super Cool Session');
    cy.get('.description').contains('It is a Super Cool Session');
    cy.get('[data-testid="number-of-attendees"]').contains('1 attendees');
    cy.get('[data-testid="delete-button"]').should('not.exist');
  });
});
