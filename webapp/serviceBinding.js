function initModel() {
	var sUrl = "/successfactors_T2/odata/v2/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}