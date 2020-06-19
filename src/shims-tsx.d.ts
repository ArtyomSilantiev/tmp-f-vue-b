import Vue, { VNode } from 'vue';

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    middleware?: string[];
    layout?: string;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    setLayout(layout: string): void;
  }
}

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}