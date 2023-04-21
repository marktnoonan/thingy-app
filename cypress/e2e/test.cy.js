Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log('Cypress detected uncaught exception: ', err);
  return false;
});


describe("Aaaah! Vocado", () => {

  it("The plain HTML version works", () => {
    cy.visit("/");
    cy.contains("Toggle JS").click();
    cy.contains("h2", "Avocado Diagram").should("be.visible");
  });

  it("The tab-control interactions work", () => {
    cy.visit("/");

    // click the 2nd tab
    cy.get("[aria-label='Avocado Diagram']").within(() => {
      cy.get("a").eq(1).click(); // needs accessible name
    });

    // ⛔️ weird selector that only works by coincidence of how Headless UI is implemented - we should use accessible name
    cy.get(".popover-activator:not([tabindex])").click();

    cy.contains("h3", "Mesocarp").should("be.visible").type("{esc}");

    cy.contains("h3", "Mesocarp").should("not.exist");
  });

  it("The scroll interactions work", () => {
    cy.visit("/");

    cy.window().then(async (win) => {
      win.timeline.scrollTrigger.scroll(600);
      cy.wait(0);

      // ⛔️ weird selector that only works by coincidence of how Headless UI is implemented - we should use accessible name
      cy.get(".popover-activator").eq(3).click();

      cy.contains("h3", "Inside every").should("be.visible");
    });
  });
});
