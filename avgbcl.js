function IMPiViewModel() {
	var self = this;
	
	/*
	*
	*  Data
	*
	*/
	
	self.jobname = ko.observable('Job 1');
	self.description_avgbcl = ko.observable('');
	
	self.data_files = ko.observable();// ko.observableArray([null]);
	/*self.data_type_avgbcl = ko.observable();
	self.x_label_avgbcl = ko.observable();
	self.y_label_avgbcl = ko.observable();*/
	
	self.email_notification_avgbcl = ko.observable("no");
    
    /*self.DeleteDat = function(data) {
	    self.data_files.remove(data);
	}
	
	self.AddDat = function() {
	    self.data_files.push(null);
	}*/
	
	self.start_job_avgbcl = function() {
		if(site.User())
		{
    	    try
            {
    			$("#avgbcl_input").hide();
    			$("#loading_avgbcl").show();
    			
    			var form = $("form#avgbcl-form")
    			
    			/*var em = false;
    			if(self.email_notification() == "yes") {
    			    em = true;
    			}*/
			    
        		var formData = new FormData(form[0]);
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        //alert(validateJobName(self.jobname()));
    		        
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#avgbcl_input").show();
    			    $("#loading_avgbcl").hide();
    		        return;
    		    }
    		    
    		    formData.append('data_files', ko.toJSON(self.data_files()));
    		    /*formData.append('data_type_avgbcl', self.data_type_avgbcl());
    		    formData.append('x_label_avgbcl', self.x_label_avgbcl());
    		    formData.append('y_label_avgbcl', self.y_label_avgbcl());*/
    		    
    		    formData.append('description_avgbcl', self.description_avgbcl());
    		    formData.append('email_notification_avgbcl', self.email_notification_avgbcl());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/avgbcl",
        		    type: "POST",
        		    data: formData,
        		    success: function(id) {
        				job.getJobs()
        			    window.location = "/#jobs/" + id
        			},
        			error: function(http) {
        				$("#error_heading").html("Error running MD-TASK");
        				if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when attempting to run the job. Please check your input and try again.");
        				}
        				
        				$("#errorModal").modal('show');
        				$("#avgbcl_input").show();
        				$("#loading_avgbcl").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#avgbcl_input").show();
				$("#loading_avgbcl").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
    
	function validateJobName(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
}

/*function clearAutoModel() {
	autoModelViewModel.clearAutoModel();
}*/

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("averagebcl"));
//ko.applyBindings(impi, document.getElementById("upload_data"));
