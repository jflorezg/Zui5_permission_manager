sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/epiuse/permission_manager/Zui5_permission_manager/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.epiuse.permission_manager.Zui5_permission_manager.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createUserModel(),"userapi");
		}
	});
});