sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/Filter',
	"sap/ui/model/json/JSONModel"
], function (Controller, Filter, JSONModel) {
	"use strict";

	return Controller.extend("com.epiuse.permission_manager.Zui5_permission_manager.controller.Manager", {
		searchRole: function (nameKey, myArray) {
			for (var i = 0; i < myArray.length; i++) {
				if (myArray[i].roleName === nameKey) {
					return [myArray[i]];
				}
			}
			return [];
		},
		onInit: async function () {
			var dialog = new sap.m.Dialog({
				title: 'Error Autorización',
				type: 'Message',
				state: 'Error',
				content: new sap.m.Text({
						text: "No tienes la autorización necesaria para usar esta aplicación!"
					})
				
			});
			this.countryIso = "";
			var oView = this.getView();
			//oView.setBusy(true);
			var oModelcheck = this.getOwnerComponent().getModel("sfmodel");
			var userModel = new sap.ui.model.json.JSONModel("/services/userapi/currentUser");
			var execu = await this.resolveAfter2Seconds(20);
			this.userAc = this.getOwnerComponent().getModel("userapi").getProperty("/");
			console.log(this.userAc);
			if (this.userAc.name !== "") {

				oView.setBusy(false);
			await this.getCountry("3813803");	
			//	await this.getCountry(this.userAc.name);

				var execu2 = await this.resolveAfter2Seconds(20);
				var oModelDiv = this.getOwnerComponent().getModel("pwModel");
				var aFiltersPwd = [];
				aFiltersPwd.push(new Filter("CountryISO", sap.ui.model.FilterOperator.EQ, this.countryIso));

				//aFiltersPwd.push(new Filter("userId", sap.ui.model.FilterOperator.EQ, sempId));
				oModelDiv.read("/DIVISIONS", {
					filters: aFiltersPwd,
					success: function (oDataDiv, oResponsePwd) {

						console.log(oDataDiv.results);
						if (oDataDiv.results.length > 0) {
							this.getView().setModel(this.jModel);
							var oODataJSONModel = new sap.ui.model.json.JSONModel();
							// set the odata JSON as data of JSON model
							oODataJSONModel.setData(oDataDiv);
							oODataJSONModel.setSizeLimit(1000);
							this.getView().setModel(oODataJSONModel, "divModel");
						} else {

						}
					}.bind(this),
					error: function (oResponse) {

						console.log(oResponse);
					}.bind(this)

				});
				var oModelArea = this.getOwnerComponent().getModel("pwModel");

				//aFiltersPwd.push(new Filter("userId", sap.ui.model.FilterOperator.EQ, sempId));
				oModelArea.read("/AREAS", {

					success: function (oDataDiv, oResponsePwd) {

						console.log(oDataDiv.results);
						if (oDataDiv.results.length > 0) {
							this.getView().setModel(this.jModel);
							var oODataJSONModel = new sap.ui.model.json.JSONModel();
							// set the odata JSON as data of JSON model
							oODataJSONModel.setData(oDataDiv);
							this.getView().setModel(oODataJSONModel, "areaModel");
						} else {

						}
					}.bind(this),
					error: function (oResponse) {

						console.log(oResponse);
					}.bind(this)

				});

			} else {
				var msg = oEvent.getParameter("errorObject").textStatus;
				if (msg) {
					this.setData("status", msg);
				} else {
					this.setData("status", "Unknown error retrieving user info");
				}
			}

			this._data = {
				Employees: [],
				Permissions: [],
				tPermissions: []
			};
			this.jModel = new sap.ui.model.json.JSONModel();
			this.jModel.setData(this._data);
			this.jModel.refresh();
			this.getView().setModel(this.jModel);

		},
		resolveAfter2Seconds: function (x) {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve(x);
				}, 1000);
			});
		},
		searchEmployee: function (oEvent) {
			var sempId = this.byId("empId").getValue();
			console.log(sempId);
			var sUrl = "/SCI?filter=userName eq '" + sempId + "'";
			var oView = this.getView();
			oView.setBusy(true);
			var self = this;
			$.get(sUrl).done(function (results) {
oView.setBusy(false);
				if (results.Resources.length > 0) {
					if(results.Resources[0].addresses[0].country !== this.countryIso){
						sap.m.MessageToast.show("El empleado pertenece a un pais diferente al que puedes acceder!");
						this.clearFields();
						return false;
					}
					this.byId("empIdLbl").setText(results.Resources[0].userName);
					this.byId("empNameLbl").setText(results.Resources[0].name.givenName + " " + results.Resources[0].name.familyName);
					var oModelPwd = this.getOwnerComponent().getModel("pwModel");
					var aFiltersPwd = [];
					aFiltersPwd.push(new Filter("userId", sap.ui.model.FilterOperator.EQ, sempId));
					oModelPwd.read("/PERMISSIONSAREA", {
						urlParameters: {
							"$expand": "Areas"
						},
						filters: aFiltersPwd,
						success: function (oDataPwd, oResponsePwd) {
							oView.setBusy(false);
							console.log(oDataPwd.results);
							if (oDataPwd.results.length > 0) {
								this._data.tPermissions = oDataPwd.results;
								this.jModel.refresh();

							} else {
								this._data.tPermissions = [];
								this.jModel.refresh();
							}
						}.bind(this),
						error: function (oResponse) {
							oView.setBusy(false);
							console.log(oResponse);
						}.bind(this)

					});

				} else {
					this.byId("empIdLbl").setText("");
					this.byId("empNameLbl").setText("");
					this._data = {
						Employees: [],
						Permissions: [],
						tPermissions: []
					};
					this.jModel.refresh();
					oView.setBusy(false);
					sap.m.MessageToast.show("El empleado no se encuentra dado de alta en el IDP!");
				}
				console.log(results);
			}.bind(this)).fail(function (err) {
				oView.setBusy(false);
				if (err !== undefined) {
					var oErrorResponser = JSON.parse(err.responseText);
					console.log(oErrorResponser.message);
					sap.m.MessageToast.show("Error de comunicación con el IDP, favor contactar al Administrador! ");
				}
			}.bind(this));

			/*var aEmployee = this._data.Employees.filter(item => item.empId === sempId);
			if (aEmployee.length > 0) {
				this.byId("empIdLbl").setText(aEmployee[0].empId);
				this.byId("empNameLbl").setText(aEmployee[0].Name);
				var apermissions = this._data.Permissions.filter(item => item.empId === sempId);
				if (apermissions.length > 0) {
					this._data.tPermissions = apermissions;
					this.jModel.refresh();

				} else {
					this._data.tPermissions = [];
					this.jModel.refresh();
				}
			} else {
				sap.m.MessageToast.show("No existe registro asociado a este No Empleado! ");
				return false;
			}*/
		},
		getCountry: async function (sUser) {

			var sUrl = "/SCI?filter=userName eq '" + sUser + "'";
			var oView = this.getView();
			oView.setBusy(true);
			var self = this;
			$.get(sUrl).done(function (results) {
					oView.setBusy(false);
				if (results.Resources.length > 0) {

					this.countryIso = results.Resources[0].addresses[0].country;

				} else {}
				console.log(results);
			}.bind(this)).fail(function (err) {
				oView.setBusy(false);
				if (err !== undefined) {
					var oErrorResponser = JSON.parse(err.responseText);
					console.log(oErrorResponser.message);
					sap.m.MessageToast.show("Error de comunicación con el IDP, favor contactar al Administrador! ");
				}
			}.bind(this));
		},
		onAddPermission: function (oEvent) {
			var empid = this.byId("empIdLbl").getText();
			var oJson = {
				"empId": empid,
				"divisionId": "",
				"areaId": ""
			};
			var oJsonModel = new JSONModel(oJson);
			this.getView().setModel(oJsonModel, "frmAddPermissions");
			this._getDialogPermissions().open();
		},
		_getDialogPermissions: function () {
			var empid = this.byId("empIdLbl").getText();
			if (empid === " ") {
				sap.m.MessageToast.show("Debe seleccionar primero un empleado para realizar esta acción! ");
				return false;
			}
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment("addNewFrag", "com.epiuse.permission_manager.Zui5_permission_manager.Fragment.AddPermission",
					this);
				this.getView().addDependent(this.oDialog);
			}
			return this.oDialog;
		},
		closeExclusion: function () {
			this.oDialog.close();
		},
		addNewPermission: function () {
			var that = this;
			var oView = this.getView();
			var oJson = oView.getModel("frmAddPermissions").getProperty("/");
			console.log(oJson);
			if (oJson.divisionId == "" || oJson.areaId == "") {
				sap.m.MessageToast.show("Se debe seleccionar una división y un área! ");
				return false;
			}
			var oModelDiv = this.getOwnerComponent().getModel("pwModel");
			var oModelArea = this.getOwnerComponent().getModel("pwModel");
			var Filters = [];
			var filterEmployee = new sap.ui.model.Filter({
				path: "userId",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: oJson.empId
			});
			Filters.push(filterEmployee);
			filterEmployee = new sap.ui.model.Filter({
				path: "divId",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: oJson.divisionId
			});
			Filters.push(filterEmployee);
			Filters.and = true;
			oModelDiv.read("/PERMISSIONS", {
				filters: Filters,
				success: function (oData, oResponse) {
					if (oData.results.length > 0) {
						this._insertAreas(oJson.empId, oJson.divisionId, oJson.areaId);
					} else {
						this._insertDivision(oJson.empId, oJson.divisionId);
						this._insertAreas(oJson.empId, oJson.divisionId, oJson.areaId);
					}
				}.bind(this),
				error: function (response) {

				}.bind(this)
			});

		},
		_insertDivision: function (userId, divId) {
			var oModelArea = this.getOwnerComponent().getModel("pwModel");
			var oEntry = {};
			oEntry.Id = 0;
			oEntry.userId = userId;
			oEntry.divId = divId;

			oModelArea.create("/INSERT_DIV", oEntry, {
				success: function (oDataDiv, response) {
					sap.m.MessageToast.show("Division asignada con exito! ");
				}.bind(this),
				error: function (oError) {
					console.log("Update failed ");
				}
			});
		},
		_insertAreas: function (userId, divId, areaId) {
			var oModelArea = this.getOwnerComponent().getModel("pwModel");
			//	var oModelAreaIn = this.getOwnerComponent().getModel("pwModel");
			var Filters = [];
			var filterEmployee = new sap.ui.model.Filter({
				path: "userId",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: userId
			});
			Filters.push(filterEmployee);
			filterEmployee = new sap.ui.model.Filter({
				path: "divId",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: divId
			});
			Filters.push(filterEmployee);
			filterEmployee = new sap.ui.model.Filter({
				path: "areaId",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: areaId
			});
			Filters.push(filterEmployee);
			Filters.and = true;
			oModelArea.read("/INSERT_AREA", {
				filters: Filters,
				success: function (oData, oResponse) {
					if (oData.results.length > 0) {
						sap.m.MessageToast.show("Este permiso ya se encuentra asignado! ");
					} else {
						var oEntry = {};
						oEntry.Id = 0;
						oEntry.userId = userId;
						oEntry.divId = divId;
						oEntry.areaId = areaId;
						oModelArea.create("/INSERT_AREA", oEntry, {
							success: function (oDataDiv, response) {
								sap.m.MessageToast.show("Permiso asignado con exito! ");
								this._refreshTable();
							}.bind(this),
							error: function (oError) {
								console.log("Update failed ");
							}
						});
					}
				}.bind(this),
				error: function (response) {

				}.bind(this)
			});

		},
		_refreshTable: function () {
			var sempId = this.byId("empId").getValue();
			var oModelPwd = this.getOwnerComponent().getModel("pwModel");
			var aFiltersPwd = [];
			var oView = this.getView();
			aFiltersPwd.push(new Filter("userId", sap.ui.model.FilterOperator.EQ, sempId));
			oModelPwd.read("/PERMISSIONSAREA", {
				urlParameters: {
					"$expand": "Areas"
				},
				filters: aFiltersPwd,
				success: function (oDataPwd, oResponsePwd) {
					oView.setBusy(false);
					console.log(oDataPwd.results);
					if (oDataPwd.results.length > 0) {
						this._data.tPermissions = oDataPwd.results;
						this.jModel.refresh();

					} else {
						this._data.tPermissions = [];
						this.jModel.refresh();
					}
				}.bind(this),
				error: function (oResponse) {
					oView.setBusy(false);
					console.log(oResponse);
				}.bind(this)

			});
		},
		deletePermission: function (oEvent) {
			var empid = oEvent.getSource().getCustomData()[0].getValue();
			var divid = oEvent.getSource().getCustomData()[1].getValue();
			var areaid = oEvent.getSource().getCustomData()[2].getValue();
			var perid = oEvent.getSource().getCustomData()[3].getValue();
			var oJson = {
				"empId": empid,
				"divisionId": divid,
				"areaId": areaid
			};
			var oModelPwd = this.getOwnerComponent().getModel("pwModel");
			oModelPwd.remove("/PERMISSIONSAREA(" + perid + ")", {
				method: "DELETE",
				success: function (data) {
					sap.m.MessageToast.show("Permiso eliminado con exito! ");
					this._refreshTable();
				}.bind(this),
				error: function (e) {

				}.bind(this)
			});

			console.log(empid + " " + divid + " " + areaid + " " + perid);

		},
		remove: function (element) {

			//const index2 = this._data.tPermissions.indexOf(element);

			this.jModel.refresh();
		},
		clearFields: function(){
			this.byId("empIdLbl").setText("");
					this.byId("empNameLbl").setText("");
					this._data = {
						Employees: [],
						Permissions: [],
						tPermissions: []
					};
					this.jModel.refresh();
		}

	});
});