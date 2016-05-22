/**
 * @properties={typeid:24,uuid:"5FB52B9A-A9E9-4078-991C-321116F83EDF"}
 */
function createRecord(data, tablename) {
	var pk
	if (data instanceof Array) {
		for (var i = 0; i < data.length; i++) {
			var row = data[i];
			pk = insertRow(row, tablename);
		}
		plugins.rawSQL.flushAllClientsCache("big_dating","merged_data_analysc");
	} else {
		pk = insertRow(data, tablename)
	}
	return pk;
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
		} else if (typeof(value) === "object") {
			insertRow(value, key, pk, tablename);
		}
		application.output(parsedval)


		var sql;
		var args = [application.getUUID().toString(), tablename, key, parsedval, pk, new Date()];
		if (fk) {
			sql = "insert into bigdb (bigdb_id, table_name, column_name, data, pk, time_stamp, fk, fk_table_name) values (?, ?, ?, ?, ?, ?, ?, ?)"; 
			args.push(fk);
			args.push(fkTable);
		} else {
			sql = "insert into bigdb (bigdb_id, table_name, column_name, data, pk, time_stamp) values (?, ?, ?, ?, ?, ?)";
		}
		application.output(plugins.rawSQL.executeSQL("big_dating","bigdb",sql, args))
	}
	return pk
}

/**
 * @param tablename
 * @param pk
 * @param [fk]
 * @param [fkTable]
 *
 * @properties={typeid:24,uuid:"4F94CF7C-C87C-4DCE-B83F-96D065D809CE"}
 */
function getJSON(tablename, pk,  fk, fkTable) {
	var sql = "select pk, column_name as key, data as value, time_stamp as time from bigdb where table_name = ? "
	var args = [tablename]
	if (pk) {
		sql += " AND pk = ? ";
		args.push(pk)
	} else {
		
	}
	sql += " ORDER BY pk"
		
	var dataset = databaseManager.getDataSetByQuery("big_dating",sql,args,-1)
		
	application.output(dataset);
	
	var columns = dataset.getColumnNames();
	var result = [];
	var lastPk;
	var data = {}
	for (var i = 1; i <= dataset.getMaxRowIndex(); i++) {
		var dsRow = dataset.getRowAsArray(i);
		var pkItem = dsRow[0]
		var key = dsRow[1]
		var value = dsRow[2]
		/** @type {Data} */
		var time = dsRow[3]
		
		data[key] = value;

		if (!lastPk) {
			lastPk = pkItem
		} else if (pkItem != lastPk) {
			if (time) {
				data.timestamp = time.getTime();
			}
			result.push(data);
			lastPk = pkItem;
			data = {}
		}

	}
	if (!result.length) {
		result.push(data)
	}
	return result
}