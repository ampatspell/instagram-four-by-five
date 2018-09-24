export default {
  name: 'square:injections',
  initialize(app) {
    app.inject('component', 'router', 'service:router');
  }
};
