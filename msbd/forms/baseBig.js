/**
 * @properties={typeid:24,uuid:"D4ECA4B9-AB13-405A-8998-C3108291EE09"}
 */
function ws_read() {
  for (var i = 0; arguments.length; i++) {
      if (typeof arguments[i] == 'String') { //The URL path additions are passed in as Strings
           application.output('URL Path addition: ' + arguments[i])
      } else {
           for each (var key in arguments[i]) {
                application.output('Query Parameter "' + key + '", values:  "' + arguments[i][key].join(', ') + '"')
           }
      }
  }
}
 
//outputs:
//URL Path addition: foo
//URL Path addition: bar
//Query Parameter "name", values:  "John"
//Query Parameter "age", values:  "30"
//Query Parameter "pet", values:  "Cat, Dog"

/**
 * @AllowToRunInFind
 * 
 * @param json
 * @param version
 * @param pk
 *
 * @properties={typeid:24,uuid:"7698614F-3808-42D4-AF79-687E133587DE"}
 */
function ws_update(json, version, pk) {
	var pkColumns = scopes.msutils.getPk(foundset)
    if (foundset.find()) {
        foundset[pkColumns] = pk
        var count = foundset.search()
        if (count > 0) {
            var rec = foundset.getRecord(1)
            databaseManager.copyMatchingFields(data,rec,true)
            databaseManager.saveData(rec)
        }
    }
}


/**
 * @param {Object} json
 * @param version
 * @param key
 *
 * @properties={typeid:24,uuid:"B7D9AD04-0460-40B3-B72C-5E1F0F64A631"}
 */
function ws_create(json, entity, key) {
	application.output(entity)
	application.output(key)
	try {
		scopes.bigdb.createRecord(json, entity)
		return 200;
	} catch (e) {
		throw 500;
	}
}



/**
 * @AllowToRunInFind
 * 
 * TODO generated, please specify type and doc for the params
 * @param version
 * @param pk
 *
 * @properties={typeid:24,uuid:"BEE82C48-5CF5-46D9-8036-97B387BB465A"}
 */
function ws_delete(version, pk) {
	var pkColumns = scopes.msutils.getPk(foundset)
    if (foundset.find()) {
     foundset[pkColumns] = pk;
     var count = foundset.search();
     if (count > 0) {
       var rec = foundset.getRecord(1);
       foundset.deleteRecord(rec);
     }
   }
}
