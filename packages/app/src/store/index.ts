import { createStore } from "vuex";

interface State {
  count: number;
}

// Create a new store instance.
const store = createStore<State>({
  state() {
    return {
      count: 0,
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {},
  modules: {},
});

export default store;
