var app = angular.module('app', []);

app.controller('MainCtl', function ($scope) {
	$scope.myData = [
		{location: "Produce", data: [
			{name: "Apples", quantity: "3"},
			{name: "Tofu", quantity: "1"}
		]},
		{location: "Spice", data: [
			{name: "Curry Powder", quantity: "1 tsp"}
		]},
		{location: "Frozen", data: [
			{name: "Blueberry Waffles", quantity: "3"}
		]},
		{location: "Mexican", data: [
			{name: "White Cooking Wine", quantity: "1"}
		]}
	];
});

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

			element.on('keydown', function(event){
				if(event.keyCode == 13){
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