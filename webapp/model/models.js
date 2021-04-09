sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createUserModel: function () {
			var oModel = new JSONModel();
			oModel.loadData("/services/userapi/currentUser");
			oModel.attachRequestCompleted(function onCompleted(oEvent) {
				if (oEvent.getParameter("success")) {
					this.setData({
						"json": this.getJSON(),
						"status": "Success"
					}, true);
				} else {
					var msg = oEvent.getParameter("errorObject").statusText;
					if (msg) this.setData("status", msg);
					else this.setData("status", "Unknown error retrieving user info");
				}
			});
			return oModel;
		}

	};
});