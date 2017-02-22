import Vue from 'vue';
import AutocompleteVue from '../../dist/js/autocomplete-vue.js';

Vue.use(require('vue-resource'));

Vue.component('autocomplete-vue', AutocompleteVue);

new Vue({
    el: '#app',
});
