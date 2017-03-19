const elixir = require('laravel-elixir');

require('laravel-elixir-vue-2');

elixir.config.assetsPath = 'src';
elixir.config.publicPath = 'dist';

elixir(mix => {
    mix.webpack('autocomplete-vue.vue', null, null, {
        output: {
            filename: 'autocomplete-vue.js',
            libraryTarget: 'umd',
            library: 'Autocomplete'
        }
    });
    mix.webpack('demo.js');
});
