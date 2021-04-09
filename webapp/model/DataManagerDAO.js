sap.ui.define([
	"sap/ui/base/Object"
], function (Object) {
	"use strict";
	return Object.extend("com.epiuse.permission_manager.Zui5_permission_manager.model.DataManagerDAO", {
		constructor: function (oContext) {
			if (oContext) this._oContext = oContext;
		},
		_getContext: function () {
			return this._oContext;
		},
		_getView: function () {
			return this._oContext.getView();
		},
		_getModel: function (sIdModel) {
			if (!sIdModel) return this._oContext.getModel();
			else return this._oContext.getModel(sIdModel);
		},

		getData: function (sIdModel, oParameters, sEntityName) {
			oParameters = jQuery.extend({
				filters: [],
				success: function () {},
				error: function () {}
			}, oParameters);
			this._getModel(sIdModel).read(sEntityName, oParameters);
		},


		createGroup: function (sIdModel, oData, oParameters, sEntityName) {
			oParameters = jQuery.extend({
				success: function () {},
				error: function () {}
			}, oParameters);
			if (oData.ID === 0) this._getModel(sIdModel).create(sEntityName, oData, oParameters);
			else {
				var route = this._getModel(sIdModel).createKey(sEntityName, {
					ID: oData.ID
				});
				this._getModel(sIdModel).update(route, oData, oParameters);
			}
		},

		saveGroup: function (sIdModel, oParameters) {
			this._getModel(sIdModel).submitChanges(oParameters);
		},

		save: function (sIdModel, oData, oParameters, sEntityName) {
			oParameters = jQuery.extend({
				success: function () {},
				error: function () {}
			}, oParameters);
			if (oData.ID === 0) this._getModel(sIdModel).create(sEntityName, oData, oParameters);
			else {
				var route = this._getModel(sIdModel).createKey(sEntityName, {
					ID: oData.ID
				});
				this._getModel(sIdModel).update(route, oData, oParameters);
			}
		}
	});
});