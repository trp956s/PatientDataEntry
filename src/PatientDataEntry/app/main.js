(function () {
    'use strict';

    angular
        .module('app')
        .controller('Main', main);

    function main() {
        var viewModel = this;
        viewModel.food = 'hello world';
    }

})();