describe('Session detail spec', () => {
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

  it('should show session infos on click on detail button as admin', () => {
    // GIVEN
    cy.interceptIsAdmin(true);
    cy.login('yoga@studio.com', 'test!1234');

    // WHEN
    cy.get('[data-testid="detail-button"]').first().click();
    cy.url().should('include', '/sessions/detail/1');

    // THEN
    cy.get('.mat-card-title').contains('Super Cool Session');
    cy.get('.description').contains('It is a Super Cool Session');
    cy.get('[data-testid="number-of-attendees"]').contains('1 attendees');
    cy.get('[data-testid="delete-button"]').should('exist');
  });

  it('should not have delete button on session detail as non admin', () => {
    // GIVEN
    cy.interceptIsAdmin(false);
    cy.login('yoga@studio.com', 'test!1234');

    // WHEN
    cy.get('[data-testid="detail-button"]').first().click();
    cy.url().should('include', '/sessions/detail/1');

    // THEN
    cy.get('.mat-card-title').contains('Super Cool Session');
    cy.get('.description').contains('It is a Super Cool Session');
    cy.get('[data-testid="number-of-attendees"]').contains('1 attendees');
    cy.get('[data-testid="delete-button"]').should('not.exist');
  });
});
