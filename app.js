var app = angular.module('app', ['ui.bootstrap', 'xeditable', 'ngRoute'], function () {
});

app.run(function (editableOptions) {
	editableOptions.theme = "bs3";
});

app.config(function ($routeProvider) {
	$routeProvider.when('/edit', {
		templateUrl: 'edit.html'
	}).when('/print', {
		templateUrl: 'print.html'
	}).otherwise({redirectTo: "/edit"});
});

app.controller('MainCtl', function ($scope, $modal) {
	if (supports_html5_storage()) {
		if(localStorage["myData"]) {
			$scope.myData = JSON.parse(localStorage["myData"]);
		} else {
			$scope.myData = bootstrapData;
			localStorage["myData"] = JSON.stringify($scope.myData);
		}

		$scope.$watch('myData', function() {
			localStorage["myData"] = JSON.stringify($scope.myData);
		}, true); // deep watch
	} else {
		$scope.myData = bootstrapData;
	}

	$scope.open = function () {
		var modalInstance = $modal.open({
			templateUrl: 'modal.html',
			controller: ModalInstanceCtrl
		});

		modalInstance.result.then(function () {
			$scope.myData = [];
		});
	}
});

var ModalInstanceCtrl = function ($scope, $modalInstance) {
	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss();
	};
};

app.directive('contenteditable', function () {
	return {
		restrict: 'A', // only activate on element attribute
		require: '?ngModel', // get a hold of NgModelController
		link: function (scope, element, attrs, ngModel) {
			if (!ngModel) {
				return;
			} // do nothing if no ng-model

			// Specify how UI should be updated
			ngModel.$render = function () {
				element.html(ngModel.$viewValue || '');
			};

			// Listen for change events to enable binding
			element.on('blur keyup change', function () {
				scope.$apply(read);
			});

			element.on('keydown', function (event) {
				if (event.keyCode == 13) {
					// Maybe go to the next field?
					event.preventDefault();
				}
			});

			// Write data to the model
			function read() {
				var html = element.html();
				// When we clear the content editable the browser leaves a <br> behind
				// If strip-br attribute is provided then we strip this out
				if (attrs.stripBr && html == '<br>') {
					html = '';
				}
				ngModel.$setViewValue(html);
			}
		}
	};
});

function supports_html5_storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

var bootstrapData = [
	{location: "Produce", data: [
		{name: "Kale", quantity: "1 bunch"},
		{name: "Tofu, extra firm", quantity: "1"}
	]},
	{location: "Bakery", data: [
		{name: "Bagels", quantity: "1 pkg"},
		{name: "Oat Nut", quantity: "loaf"}
	]},
	{location: "Dairy", data: [
		{name: "2% Milk", quantity: "half gallon"},
		{name: "Blueberry Cream Cheese", quantity: "1"},
		{name: "Almond Milk, Vanilla, Sweetened", quantity: "2"},
		{name: "Mexican Blend Shredded Cheese", quantity: "2"}
	]},
	{location: "Frozen", data: [
		{name: "Blueberry Waffles", quantity: "3"}
	]},
	{location: "Baking", data: [
		{name: "White Cooking Wine", quantity: "1"},
		{name: "Curry Powder", quantity: "lots"}
	]}
];