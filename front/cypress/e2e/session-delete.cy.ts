describe('Session delete spec', () => {
  it('should delete session successfully', () => {
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

    cy.login('yoga@studio.com', 'test!1234');
  });
});
