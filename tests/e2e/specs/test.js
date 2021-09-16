import userEvent from '@testing-library/user-event'


describe("Button {enter} test", () => {
  it("Enter toggles accordion panels", () => {
    cy.visit("https://www.w3.org/TR/wai-aria-practices-1.2/examples/accordion/accordion.html");

    cy.get('h3').eq(1).then($el => {
      $el[0].addEventListener('click', (e) => {
        e.stopPropagation()
      })
    })

    cy.get("button").eq(1).type("{enter}");

    // cy.get('button').then($buttons => userEvent.type($buttons[1], '{enter}'));
    // cy.get('button').then($buttons => userEvent.type($buttons[1], '{enter}'));

    // cy.get("button").eq(1).type("{enter}"); // expand the second panel
    // cy.get("button").eq(1).should("have.attr", "aria-expanded", "true"); // it has the attribute
    // cy.get("[role=region]").eq(0).should("have.attr", "hidden"); // first panel is now hidden
    // cy.get("button").eq(0).type("{enter}"); // expand the first panel
    // cy.get("button").eq(0).should("have.attr", "aria-disabled", "true"); // first button is now disabled
    // cy.get("button").eq(1).should("have.attr", "aria-expanded", "false"); // the second panel now has false
    // cy.get("[role=region]").eq(0).should("not.have.attr", "hidden"); // first panel is visible
  });
});



// describe("Button {enter} test", () => {
//   it("Enter toggles accordion panels", () => {
//     cy.visit("localhost:8080");

//     cy.get('.parent button').then($buttons => userEvent.type($buttons[0], '{enter}'));
//   });
// });