/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/epiuse/permission_manager/Zui5_permission_manager/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});