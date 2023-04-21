import AvocadoInfo from './AvocadoInfo.vue'

describe('<AvocadoInfo />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(AvocadoInfo)
  })
})