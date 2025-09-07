import { defineStore } from "pinia";

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export const useBUS = defineStore("BUS", {
  state: () => ({
    name: "BUS",
    count: 0,
  }),
  actions: {
    setName(name) {
      this.name = name;
    },
  },

  //   persist: true,//会存在cookie中
  persist: {
    storage: import.meta.client ? localStorage : null,
  },
});

// export const BUS = useBUS();
