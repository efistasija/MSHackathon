/**
 * @param version
 * @param method
 *
 * @properties={typeid:24,uuid:"18A9923F-03B2-480E-B49F-078BC48AF2CA"}
 */
function ws_read(version, method) {
    var sql = "select merged_data_analysc_id from merged_data_analysc"
    var dataset = databaseManager.getDataSetByQuery("big_dating", sql, [], -1)
    var allPks = dataset.getColumnAsArray(1)
            if (allPks.length > 0) {
                var json = plugins.mobileservice.getRowDescriptions(foundset.getDataSource(), allPks)
                return json
            }
 
    throw 404;
}