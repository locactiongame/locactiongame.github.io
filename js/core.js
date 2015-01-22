/**
	Backend classes for database and other core methods
	@module ApplicationCore
*/

//Initiate Kinvey

	var kinveyPromise = Kinvey.init({
	    appKey    : 'kid_Z17WWBd2L',
	    appSecret : '864718e1996145c88b9bd7a3e4bb7188'
	});
	kinveyPromise.then(function(activeUser) {
	   	console.log("Active User : ",activeUser)
	}, function(error) {
	    console.error("Kinvey Error : ",error)
	});

/**
	Core class for core methods
	@class core_
	@constructor
	@namespace Application
*/
var core = {
	/**
		Gets the active user if logged in 
		@method getActiveUser
		@for core_
		@param callback {Function}
	*/
	getActiveUser : function(callback){
		Kinvey.User.me({
		    success: function(response) {
		        callback(response)
		    }
		})
	},
	/**
		Logins the user with given parameters
		@method login
		@for core_
		@param username {String}
		@param password {String}
		@param callbackSuccess {Function}
		@param callbackError {Function}
	*/
	login : function(user,callbackSuccess,callbackError){
		Kinvey.User.login(user.username, user.password, {
		    success: function(response) {
		        callbackSuccess(response)
		    },
		    error : function(err){
		    	callbackError(err)
		    }
		})
	},
	/**
		Register the user to user management backend in Kinvey Engine
		@method register
		@for core_
		@param username {String}
		@param password {String}
		@param callbackSuccess {Function}
		@param callbackError {Function}
	*/
	register : function(user,callbackSuccess,callbackError){
		Kinvey.User.signup({
		    username : user.username,
		    email : user.email,
		    password : user.password
		}, {
		    success: function(response) {
		        callbackSuccess(response)
		    },
		    error : function(error){
		    	callbackError(error)
		    }
		});
	},
	/**
		Simply logs out
		@method logout
		@for core_
		@param callbac {Function}
		
	*/
	logout : function(callback){
		var user = Kinvey.getActiveUser();
		if(null !== user) {
		    var promise = Kinvey.User.logout({
		        success: function() {
		            callback()
		        }
		    });
		}
	},
	/**
		Updates the user with given object key-value pairs
		@method updateUser
		@for core_
		@param user {Object}
	*/
	updateUser : function(user){
		Kinvey.User.update(user, {
		    success: function() {
		        console.log("Successfully updated user!")
		    }
		});
	},
	/**
		Sends a reset email to the user's email
		@method passwordReset
		@for core_
		@param username {String}
	*/
	passwordReset : function(username){
		Kinvey.User.resetPassword(username, {
		    success: function() {
		        console.log("Password reset link has been sent to the user email!")
		    }
		});
	},
	/**
		Saves given object to the table
		@method save
		@for core_
		@param table {String}
		@param data {Object}
		@param callback {Function}
	*/
	save : function(table,data,callback){
		console.log(table,data)
		Kinvey.DataStore.save(table, data, {
		    success: function(response) {
		        callback(response)
		    }
		});
	},
	/**
		Fetches table with given table name
		@method getTable
		@for core_
		@param table {String}
		@param callback {Function}
	*/
	getTable : function(table,callback){
		kinveyPromise.then(function(){
			Kinvey.DataStore.find(table, null, {
			    success: function(response) {
			        callback(response)
			    }
			});
		})
		
	},
	/**
		Fetches rows between given offset and limit and table name
		@method getTableBetween
		@for core_
		@param table {String}
		@param offset {Integer}
		@param limit {Integer}
		@param callback {Function}
	*/
	getTableBetween : function(table,offset,limit,callback){
		kinveyPromise.then(function(){
			var query = new Kinvey.Query();
			query.limit(limit);
			query.skip(offset);

			Kinvey.DataStore.find(table, query, {
			    success: function(response) {
			        callback(response)
			    }
			});
		})
		
	},
	/**
		Fetches the row in table with given table name and __id__
		@method getItem
		@for core_
		@param table {String}
		@param id {String}
		@param callback {Function}
	*/
	getItem : function(table,id,callback){
		kinveyPromise.then(function(){
			Kinvey.DataStore.get(table, id, {
			    success: function(response) {
			        callback(response)
			    }
			});
		})
		
	},
	/**
		Deletes the item from table with given item ID
		@method deleteItem
		@for core_
		@param table {String}
		@param id {String}
		@param callback {Function}
	*/
	deleteItem : function(table,id,callback){
		Kinvey.DataStore.destroy(table, id, {
		    success: function(response) {
		        callback(response)
		    }
		});
	},
	/**
		Uploads file in input element with given id. Uploads only one file !
		@method uploadFile
		@for core_
		@param elementID {String}
		@param callback {Function}
	*/
	uploadFile : function(elementID,callback){
		console.log(elementID)
		var uploads = [];
		var fileList = document.getElementById(elementID).files;
		for(var i = 0, length = fileList.length; i < length; i += 1) {
            var file = fileList.item(i);
            uploads.push(Kinvey.File.upload(file, null, {
			    public  : true,
			    success : function(file) {
			        console.log("Successfully uploaded ",file)
			    }
			}));
        }
        // Wait until all files are uploaded.
        var promise = Kinvey.Defer.all(uploads);
        promise.then(function(response) {
            callback(response)
        }, function(error) {
            // One or more uploads failed.
        });
	},
	/**
		Fetches download_url for given file ID
		@method getFileURL
		@for core_
		@param id {String}
		@param callback {Function}
	*/
	getFileURL : function(id,callback){
		Kinvey.File.stream(id, {
		    success: function(file) {
		        callback(file)
		    }
		});
	},
	/**
		Deletes the file from file system in kinvey engine with given file ID
		@method deleteFile
		@for core_
		@param fileID {String}
		@param callback {Function}
	*/
	deleteFile : function(fileID,callback){
		var promise = Kinvey.File.destroy(fileID, {
		    success: function(r) {
		        callback(r);
		    }
		});
	},
	/**
		Fetches all files in file system with id's and the other attributes
		@method getAllfiles
		@for core_
		@param callback {Function}
	*/
	getAllfiles : function(callback){
		kinveyPromise.then(function(){
			var promise = Kinvey.File.find(null, {
			    success: function(response) {
			        callback(response)
			    }
			});
		})
	},
	/**
		Returns a list of all registered users
		@method getAllUsers
		@for core_
		@param callback {Function}
	*/
	getAllUsers : function(callback){
		var query = new Kinvey.Query();
		kinveyPromise.then(function(){
			var promise = Kinvey.User.find(query, {
			    success  : function(response) {
			        callback(response)
			    }
			});
		})
		
	},
	/**
		Fetches all users checked in to the <br/>
		 location and executes the callback function
		@method usersInLocation
		@param locationID
	*/
	usersInLocation : function(locationID,callback){
		var query = new Kinvey.Query();
		query.equalTo('location', locationID);
		var promise = Kinvey.User.find(query, {
		    success  : function(response) {
		        callback(response)
		    }
		});
	}
}


Array.prototype.getKeys = function(){
	var keys = [];
	for(var k in this) keys.push(k);
		return keys
}

