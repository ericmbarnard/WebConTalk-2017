var assert = chai.assert;

describe('Repos Controller Tests', function () {
    var scope, createController, pageData;

    beforeEach(module('class-manager'));

    beforeEach(inject(function ($injector) {
        var $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');

        scope = $rootScope.$new();
        pageData = {
            repos: [
                { full_name: "test", url: "http://test.com" }
            ]
        };

        createController = function () {
            return $controller('ReposController', {
                $scope: scope,
                'page-data': pageData
            });
        };
    }));

    it('gets repos from the pageData', function () {

        var sut = createController();
        assert.isOk(scope.repos);
        assert.lengthOf(scope.repos, 1);
    });

    afterEach(function () {
        scope.$destroy();
    });
});