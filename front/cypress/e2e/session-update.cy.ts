describe('Sessions modify spec', () => {
  beforeEach(() => {
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

    cy.interceptTeachers();

    cy.interceptSessions();
  });
  it('should update session successfully when all fields are valid', () => {
    // GIVEN
    cy.interceptIsAdmin(true);

    cy.intercept(
      {
        method: 'PUT',
        url: '/api/session/1',
      },
      {
        statusCode: 200,
      }
    ).as('teacher');

    // WHEN
    cy.login('yoga@studio.com', 'test!1234');

    cy.get('[data-testid="edit-button"]').should('exist');
    cy.get('[data-testid="edit-button"]').first().click();

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

    // THEN
    cy.url().should('contain', '/sessions');
  });

  it('should not have update button if user is not admin', () => {
    // GIVEN
    cy.interceptIsAdmin(false);

    cy.intercept(
      {
        method: 'PUT',
        url: '/api/session/1',
      },
      {
        statusCode: 200,
      }
    ).as('teacher');

    // WHEN
    cy.login('yoga@studio.com', 'test!1234');

    // THEN
    cy.url().should('contain', '/sessions');
    cy.get('[data-testid="edit-button"]').should('not.exist');
  });
});
