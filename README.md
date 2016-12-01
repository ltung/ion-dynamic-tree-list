# ion-dynamic-tree-list

Ionic directive for displaying nested list ionic items. This project is modified from ```ion-tree-list```. While ```ion-tree-list``` is perfectly ok, it takes a while to load 1000+ nodes. I had an application that needed to handle this load and after a little research, the two way binding
 of Angular JS was the culprit. I decided to re-write it and load the subtree only when it is opened by the user.
 It results a faster rendering time. I decided to rename it to ```ion-dynamic-tree-list``` since the usage is quite different and it worked for me and hopefully, someone else will find it useful. 

## Installation

```
bower install ion-dynamic-tree-list --save
```

Add somewhere in your HEAD tag:

```
<script src="lib/ion-dynamic-tree-list/ion-dynamic-tree-list.js"></script>
```

You'll need to add ```ion-dynamic-tree-list``` as a dependency on your Ionic app:

```
angular.module('starter', [
    'ionic', 
    'controllers', 
    'services', 
    'ion-dynamic-tree-list'
])
```

In your ```controller.js```:

```
  $scope.tasks = [{id: 1, parentid: 0, name: 'task 1'},
    {id: 2, parentid: 1, name: 'task 1.1'},
    {id: 3, parentid: 0, name: 'task 2'},
    {id: 4, parentid: 0, name: 'task 3'}
   ];

```

Or, you could load your ```$scope.tasks``` from database, e.g.:

Assuming your table structure is:

| Column        | Type          |
| ------------- |:-------------:|
| id            | int           | 
| parentid      | int           | 
| name          | varchar(40)   | 

Note that the display order of an element follows the position of it in the array. So, you need to use "order by" in
your database statement to control the display order of the tree.

```
    $http.get('http://yourwebsite/GetTasks').
       then(function (response) {
           $scope.tasks = response.data;
        });
```

In your ```view.html```:

```
<ion-dynamic-tree-list items="" source="tasks"></ion-dynamic-tree-list>
```

Fetch clicked item by listening to ```$ionDynamicTreeList:ItemChosen``` in your controller:

## Emmited events

```
$scope.$on('$ionDynamicTreeList:ItemChosen', function(event, item) {
  // process 'item'
  console.log(item);
});

```

## Custom templates

Imagine your tasks in ```$scope.tasks``` in your ```controller.js``` has an extra attribute as ```checked```:

```
  $scope.tasks = [{id: 1, parentid: 0, name: 'task 1', checked: false},
      {id: 2, parentid: 1, name: 'task 1.1', checked: false},
      {id: 3, parentid: 0, name: 'task 2', checked: true},
      {id: 4, parentid: 0, name: 'task 3', checked: false}
     ];
```

In order to consume the ```checked``` value in your view, create a ```ion-item.tmpl.html``` file in 
your www folder containing the following:

```
<input type="checkbox" ng-model="item.checked"/>
{{item.name}}
```

Add an extra ```template-url``` attribute for your custom template:
 
```
<ion-dynamic-tree-list items="" source="tasks" template-url="'ion-item.tmpl.html'"></ion-dynamic-tree-list>
```

## Contributing

Please email me on my [email](mailto:ltung@live.com) if you needs a fix. Else, please report your issue in [here](https://github.com/ltung/ion-dynamic-tree-list/issues).

Code contribution is always welcomed.

## Acknowledgment

Forked from ```ion-tree-list``` in  [here](https://github.com/fer/ion-tree-list)

## To-dos

* Angular JS 2! Waiting for Ionic 2 to finalize.
* More complete Unit Test in Jasmine.
* Combine "items" and "source" into one?
* Add additional emit event when a tree is being collapse/expand for easier change by a developer?