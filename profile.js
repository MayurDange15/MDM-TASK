var loaded = false;

function ProfileViewModel() {
	var self = this;
	
	self.username = ko.observable();
	self.date_joined = ko.observable();
	self.last_online = ko.observable();
	self.email = ko.observable();
	self.user_id = ko.observable();
	
	self.user_error = ko.observable();
	self.user_success = ko.observable();
	
	self.old_password = ko.observable();
	self.new_password = ko.observable();
	self.confirm_password = ko.observable();
	
	self.selectedConversation = ko.observable();
	self.conversationIntervalID = null;
	
	self.getUser = function() {
		
		$("#user_content").hide();
		$("#loading_user").show();
		
		$.ajax({
			url: "/api/users/profile",
			success: function(result) {
				self.username(result.user.username);
				
				var dj = result.user.date_joined.slice(0, -1).split("T");
				self.date_joined(dj[0] + " " + dj[1]);
				
				var lo = result.user.last_login.slice(0, -1).split("T");
				self.last_online(lo[0] + " " + lo[1]);
				
				self.email(result.user.email);
				self.user_id(result.id);
				
				self.user_error("");
				self.user_success("");
				
				$("#loading_user").hide();
				$("#user_content").show();		
			},
			error: function() {			
				self.user_error("Error loading user details");
				self.user_success("");
		
				$("#loading_user").hide();
				$("#user_content").show();			
			}
		});
	}
	
	self.updateUser = function() {
		
		$("#user_content").hide();
		$("#loading_user").show();
		
		$.ajax({
			url: "/api/users/profile/",
			type: "PUT",
			data: { email: self.email() },
			success: function(result) {
				self.username(result.user.username);
				
				var dj = result.user.date_joined.slice(0, -1).split("T");
				self.date_joined(dj[0] + " " + dj[1]);
				
				var lo = result.user.last_login.slice(0, -1).split("T");
				self.last_online(lo[0] + " " + lo[1]);
				
				self.email(result.user.email);
				self.user_id(result.id);		
				
				$("#loading_user").hide();
				$("#user_content").show();
				
				self.user_error("");
				self.user_success("User details saved successfully");
			},
			error: function() {
				self.user_error("Error saving user details");
				self.user_success("");
				
				$("#loading_user").hide();
				$("#user_content").show();
			}
		});
	}
	
	
	self.showUpdatePassword = function() {
		$('#passwordModal').modal('show');
	}
	
	self.updatePassword = function() {
		var old_password = $("#old_password").val();
		var new_password = $("#change_password").val();
		var confirm_password = $("#confirm_password_change").val();
				
		if(new_password == confirm_password) {
			$.ajax({
				url: "/api/users/password",
				type: "PUT",
				data: { old_password: old_password, new_password: new_password },
				success: function(result) {
					$('#passwordModal').modal('hide');
				},
				error: function(http) {
					alert(http.responseText)
				}				
			});
		} else {
		    alert("Passwords do not match");
		}
	}
}

var profile = new ProfileViewModel()
ko.applyBindings(profile, document.getElementById("profile"));