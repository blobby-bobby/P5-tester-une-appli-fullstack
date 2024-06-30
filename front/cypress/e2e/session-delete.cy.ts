describe('Session delete spec', () => {
  it('admin should be able to delete a session', () => {
    // GIVEN
    cy.interceptIsAdmin(true);
    cy.interceptSessions();
    cy.interceptSessionDetail();
    cy.interceptTeachers();

    cy.intercept(
      {
        method: 'DELETE',
        url: '/api/session/1',
      },
      {
        statusCode: 200,
      }
    ).as('teacher');

    cy.login('yoga@studio.com', 'test!1234');

    // WHEN
    cy.get('[data-testid="detail-button"]').first().click();
    cy.get('[data-testid="delete-button"]').should('contain', 'Delete').click();

    // THEN
    cy.url().should('include', '/sessions');
  });
});
