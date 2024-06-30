// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): void;
    interceptSessions(): void;
    interceptSessionDetail(): void;
    interceptTeachers(): void;
    interceptIsAdmin(admin: boolean): void;
  }
}

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[formControlName=email]').should('exist');
  cy.get('input[formControlName=password]').should('exist');
  cy.get('input[formControlName=email]').type(email);
  cy.get('input[formControlName=password]').type(`${password}{enter}{enter}`);
});

Cypress.Commands.add('interceptSessions', () => {
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
        users: [1],
        createdAt: '2024-05-29T17:03:24',
        updatedAt: '2024-05-29T17:03:24',
      },
      {
        id: 2,
        name: 'Another Super Cool Session',
        date: '2024-05-29T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'It is another Super Cool Session',
        users: [1],
        createdAt: '2024-05-29T17:03:24',
        updatedAt: '2024-05-29T17:03:24',
      },
    ]
  ).as('session');
});

Cypress.Commands.add('interceptTeachers', () => {
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

Cypress.Commands.add('interceptSessionDetail', () => {
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
});

Cypress.Commands.add('interceptIsAdmin', (admin: boolean) => {
  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: 1,
      username: 'JohnnyBravo',
      firstName: 'Johnny',
      lastName: 'Bravo',
      admin: admin,
    },
  });
});
