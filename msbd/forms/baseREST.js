/**
 * TODO generated, please specify type and doc for the params
 * @param useruid
 * @param password
 *
 * @properties={typeid:24,uuid:"0FD1E496-E5D7-47B7-95CA-B994C7E707A0"}
 */
function ws_authenticate(useruid, password) {
    if (password === 'demo') { //static demo check
        return {
          username: useruid
        }
    }
    return false;
}




/**
 * @properties={typeid:24,uuid:"65A3EACA-35C7-4AD7-8CCB-290BEF1823CF"}
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
 * @param data
 * @param version
 * @param pk
 *
 * @properties={typeid:24,uuid:"CC32E12A-34A9-43B0-9A40-EC80E13A87FD"}
 */
function ws_update(data, version, pk) {
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
 * @param data
 * @param version
 * @param pk
 *
 * @properties={typeid:24,uuid:"0F1C5ABB-BCF7-4EA7-9959-7FBA2C212189"}
 */
function ws_create(data, version, pk) {
    var rec = foundset.getRecord(foundset.newRecord())
    databaseManager.copyMatchingFields(data,rec,true)
    databaseManager.saveData(rec)
}



/**
 * @AllowToRunInFind
 * 
 * TODO generated, please specify type and doc for the params
 * @param version
 * @param pk
 *
 * @properties={typeid:24,uuid:"87D52687-76B1-40D8-93B6-C0685533F034"}
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
