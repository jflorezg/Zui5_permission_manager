/*global QUnit*/

sap.ui.define([
	"com/epiuse/permission_manager/Zui5_permission_manager/controller/Manager.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Manager Controller");

	QUnit.test("I should test the Manager controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});