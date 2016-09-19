// 'use strict';
//
// var React = require('react');
// var Unicycle = require('../../Unicycle');
//
// var appNavigatorRoutesStore = Unicycle.createStore({
//
//   init: function() {
//     let LandingPage = require('../../Components/LandingPage');
//     this.set({
//       routeStack: [
//         {
//           id: 0,
//           component: <LandingPage/>
//         }
//       ]
//     });
//   },
//
//   pop: function() {
//     if (this._getTopRouteId() === 0) {
//       return; // don't attempt to remove the base route
//     }
//
//     let routeStack = this.getRouteStack();
//     routeStack.pop();
//     this.set({
//       routeStack: routeStack
//     });
//   },
//
//   push: function(component) {
//     let routeStack = this.getRouteStack();
//     let nextId = this._getTopRouteId() + 1;
//
//     routeStack.push({
//       id: nextId,
//       component: component
//     });
//     this.set({
//       routeStack: routeStack
//     });
//   },
//
//   getRouteStack: function() {
//     return this.get('routeStack').toJSON();
//   },
//
//   _getTopRouteId: function() {
//     let routeStack = this.getRouteStack();
//     return routeStack[routeStack.length - 1].id;
//   }
//
// });
//
// module.exports = appNavigatorRoutesStore;
