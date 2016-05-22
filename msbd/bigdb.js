/**
 * @properties={typeid:24,uuid:"5FB52B9A-A9E9-4078-991C-321116F83EDF"}
 */
function createRecord(data, tablename) {
	
	if (data instanceof Array) {
		for (var i = 0; i < data.length; i++) {
			var row = data[i];
			insertRow(row, tablename);
		}
		plugins.rawSQL.flushAllClientsCache("big_dating","merged_data_analysc");
	} else {
		insertRow(data, tablename)
	}
}

/**
 * @param {Object} row
 * @param {String} tablename
 * @param {String} [fk]
 * @param {String} [fkTable]
 *
 * @properties={typeid:24,uuid:"6ADB269C-E5E2-4D5E-9396-B0FD5355CE4D"}
 */
function insertRow(row, tablename, fk, fkTable) {
	
	var pk = application.getUUID().toString();
	for (var key in row) {
		var value = row[key]
		var parsedval
		if (value instanceof String) {
			parsedval = value
		} else if (value instanceof Number) {
			parsedval = value
		} else if (value instanceof Boolean) {
			parsedval = value
		} else if (value instanceof Array) {
			// TODO insert the parsed value
			for (var i = 0; i < value.length; i++) {
				insertRow(value[i], key, pk, tablename);
			}
		}

		var sql;
		var args = [application.getUUID().toString(), tablename, key, parsedval, pk];
		if (fk) {
			sql = "insert into bigdb (bigdb_id, table_name, column_name, data, pk, fk, fk_table_name) values (?, ?, ?, ?, ?, ?, ?)"; 
			args.push(fk);
			args.push(fkTable);
		} else {
			sql = "insert into bigdb (bigdb_id, table_name, column_name, data, pk) values (?, ?, ?, ?, ?)";
		}
		application.output(plugins.rawSQL.executeSQL("big_dating","bigdb",sql, args))
	}
	
}