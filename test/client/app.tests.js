var assert = require('chai').assert;

describe('app tests', function() {
    
    it('should say the "class-manager" module exists', function () {
        
        var mod = angular.module("class-manager");
        assert.isOk(mod);
    });
});