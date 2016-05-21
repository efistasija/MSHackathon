/**
 * @param {JSFoundSet|String} foundsetOrDatasource
 * 
 * @return {String}
 * 
 * @properties={typeid:24,uuid:"18F84AD2-8FFC-4450-BBF3-68FA5A867C1A"}
 */
function getPk(foundsetOrDatasource) {
	var table = databaseManager.getTable(foundsetOrDatasource);
	return table.getRowIdentifierColumnNames()[0];
}

