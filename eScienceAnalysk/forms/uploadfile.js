
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"6102F8DA-F9B3-49EC-8C7A-1E55DEE7F973"}
 */
function onAction(event) {
	plugins.file.showFileOpenDialog(fileUploaded)
}

/**
 * @param {Array<plugins.file.JSFile>} jsFiles
 * 
 * @properties={typeid:24,uuid:"1CE6A179-69A0-4ED8-8D73-E56B483E5453"}
 */
function fileUploaded(jsFiles) {
	elements.uploading.visible = true;
	application.updateUI();

	databaseManager.setAutoSave(false);
	
	var jsFile = jsFiles[0];
	application.output(jsFile.getAbsolutePath())
	var path = jsFile.getAbsolutePath();
	var subpath = path.replace(jsFile.getName(), "accelerometer_5second\\")
	var txtFile = plugins.file.readTXTFile(jsFile)
	application.output(subpath)
	var csvList = txtFile.split("\n");
	
	
	for (var i = 1; i < csvList.length; i++) {
		var csvItem = csvList[i]
		
		if (getFileName(csvItem).indexOf('__016570_2014-08-12 15-23-30.bin_day1') > -1) {
					
			var filePath = subpath + getFileName(csvItem)		
			var activity = getActivity(csvItem)
	
			var singleTextFile = plugins.file.readTXTFile(filePath);
			var data = parseCsv(singleTextFile, activity);
			
			var fileJSON = subpath + getFileName(csvItem) + ".json"
			saveProcessedFile(data, fileJSON);
			// postDataRecord(data);
			break;
		}
	}
	elements.uploading.visible = false

}

/**
 * @param {String} item
 *
 * @properties={typeid:24,uuid:"BE33305E-261B-4D75-85C5-96481CC95097"}
 */
function getFileName(item) {
	return item.substr(item.lastIndexOf(",") + 1).replace("RData", "csv").replace(/"/g, "")
}

/**
 * @param {String} item
 *
 * @properties={typeid:24,uuid:"4160D500-9E1B-46FB-8BEE-1280BDE2AA94"}
 */
function getActivity(item) {
	item = item.replace(/"/g, "");
	return item.split(",")[6]
}

/**
 * @properties={typeid:24,uuid:"B3D5EE7A-C657-45C7-BEA6-FFED3307C7B6"}
 */
function parseCsv(csvText, activity) {
	var lines = csvText.split("\n");
	application.output(csvText);
	var data = []
	
	var headerLine = lines[0];
	headerLine = headerLine.replace(/"/g, "");
	var columnNames = headerLine.split(",");
	
	for (var i = 1; i < lines.length; i++) {
		var line = lines[i];
		line = line.replace(/"/g, "");
		var columns = line.split(",");
		var dataItem = {
			activity: activity
		};
		for (var j = 0; j < columns.length; j++) {
			dataItem[columnNames[j]] = columns[j];
		}
		data.push(dataItem);
	}
	application.output(data);
	return data
}

/**
 * @param {Array} data
 * 
 * @properties={typeid:24,uuid:"A10316D3-2F21-4096-8100-15FC50220607"}
 */
function postDataRecord(data) {
	var fs = datasources.db.big_dating.merged_data_analysc.getFoundSet();
	application.output(data.length)
	for (var index = 0; index < data.length; index++) {		
//		//plugins.rawSQL.executeSQL(serverName,tableName,sql,sql_args)
//		var record = fs.getRecord(fs.newRecord())
//		databaseManager.copyMatchingFields(data[index],record);
		//if (index == 20) {
			//databaseManager.saveData(fs);
			//break
		//}
//		if (!index%1000) {
//			databaseManager.saveData(fs);
//			fs.clear()
//		}
		var item = data[index]
		var sql = "insert into merged_data_analysc (merged_data_analysc_id, activity, time_stamp, acceleration, anglex, angley, anglez, invalid) values (?, ?, ?, ?, ?, ?, ?, ?)"
		application.output(plugins.rawSQL.executeSQL("big_dating","merged_data_analysc",sql, [application.getUUID().toString(),item.activity, new Date(item.timestamp), utils.stringToNumber(item.acceleration), utils.stringToNumber(item.anglex), utils.stringToNumber(item.angley), utils.stringToNumber(item.anglez), utils.stringToNumber(item.invalid)]))
	}
	
	plugins.rawSQL.flushAllClientsCache("big_dating","merged_data_analysc");
	application.output("done")
	databaseManager.saveData(fs);
	fs.clear();
}

/**
 * @param {Object} data
 * @param {String} filename
 *
 * @properties={typeid:24,uuid:"C516699B-1B97-41B8-9CC7-CCBED4AA4017"}
 */
function saveProcessedFile(data, filename) {
	application.output(filename)
	application.output(plugins.file.writeTXTFile(filename,JSON.stringify(data),null,"text/json"));
}

