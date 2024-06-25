describe('Sessions modify spec', () => {
  it('should update session successfully when all fields are valid', () => {
    //Given
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
          createdAt: '2024-05-29T17:03:24',
          updatedAt: '2024-05-29T17:03:24',
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
    ).as('teachers');

    cy.intercept(
      {
        method: 'PUT',
        url: '/api/session/1',
      },
      {
        statusCode: 200,
      }
    ).as('teacher');

    //When
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.get('[data-testid="edit-button"]').should('exist');
    cy.get('[data-testid="edit-button"]').click();

    cy.get('textarea[formControlName=description]').type(
      ' , like, really, really super cool session'
    );
    cy.get('[data-testid="submit-session"]').should('be.enabled');

    cy.get('input[formControlName=name]').clear();
    cy.get('[data-testid="submit-session"]').should('be.disabled');
    cy.get('input[formControlName=name]').type('New Super Cool Session');

    cy.get('input[formControlName=date]').clear();
    cy.get('[data-testid="submit-session"]').should('be.disabled');
    cy.get('input[formControlName=date]').type('2024-11-10');

    cy.get('[data-testid="submit-session"]').click();

    //Then
    cy.url().should('contain', '/sessions');
  });

  it('should not have update button if user is not admin', () => {
    //Given
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
          createdAt: '2024-05-29T17:03:24',
          updatedAt: '2024-05-29T17:03:24',
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
    ).as('teachers');

    cy.intercept(
      {
        method: 'PUT',
        url: '/api/session/1',
      },
      {
        statusCode: 200,
      }
    ).as('teacher');

    //When
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    //Then
    cy.url().should('contain', '/sessions');
    cy.get('[data-testid="edit-button"]').should('not.exist');
  });
});
