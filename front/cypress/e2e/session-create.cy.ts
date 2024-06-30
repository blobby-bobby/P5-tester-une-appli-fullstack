describe('Session create spec', () => {
  beforeEach(() => {
    cy.interceptSessionDetail();
    cy.interceptSessions();
    cy.interceptTeachers();
  });

  it('should create session successfully when all fields are valid', () => {
    // GIVEN
    cy.interceptIsAdmin(true);

    // WHEN
    cy.login('yoga@studio.com', 'test!1234');

    cy.get('[data-testid="create-button"]').should('exist');
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
    cy.interceptIsAdmin(false);

    // WHEN
    cy.login('yoga@studio.com', 'test!1234');

    // THEN
    cy.get('[data-testid="create-button"]').should('not.exist');
  });
});
