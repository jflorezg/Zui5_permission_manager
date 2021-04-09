function initModel() {
	var sUrl = "/pwdchangerTest/pwdChangerbk/services.xsodata/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}