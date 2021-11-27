function IMPiViewModel() {
	var self = this;
	
	self.jobname = ko.observable('Job 1');
	self.description_nmaa = ko.observable('');
	
	self.cg_pdb_nmaa = ko.observable();
	self.wmatrix_nmaa = ko.observable();
	self.vtmatrix_nmaa = ko.observable();
	self.conf_pdb_nmaa = ko.observable();
	self.atom_nmaa = ko.observable("cb");
	self.mode_number_nmaa = ko.observable("7");
	
	self.email_notification_nmaa = ko.observable("no");
    
	self.start_job_nmaa = function() {
		if(site.User())
		{
    	    try
            {
    			$("#nmaa_input").hide();
    			$("#loading_nmaa").show();
    			
    			var form = $("form#nmaa-form")
    			/*
    			var em = false;
    			if(self.email_notification_nmaa() == "yes") {
    			    em = true;
    			}*/
			    
        		var formData = new FormData(form[0]);
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        //alert(validateJobName(self.jobname()));
    		        
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#nmaa_input").show();
    			    $("#loading_nmaa").hide();
    		        return;
    		    }
    		    
    		    formData.append('cg_pdb_nmaa', ko.toJSON(self.cg_pdb_nmaa()));
    		    formData.append('wmatrix_nmaa', ko.toJSON(self.wmatrix_nmaa()));
    		    formData.append('vtmatrix_nmaa', ko.toJSON(self.vtmatrix_nmaa()));
    		    formData.append('conf_pdb_nmaa', ko.toJSON(self.conf_pdb_nmaa()));
    		    formData.append('atom_nmaa', self.atom_nmaa());
    		    formData.append('mode_number_nmaa', self.mode_number_nmaa());
    		    
    		    formData.append('description_nmaa', self.description_nmaa());
    		    formData.append('email_notification_nmaa', self.email_notification_nmaa());
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/nmaa",
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
        				$("#nmaa_input").show();
        				$("#loading_nmaa").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#nmaa_input").show();
				$("#loading_nmaa").hide(); 
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

function clearAutoModel() {
	autoModelViewModel.clearAutoModel();
}

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("nmaa"));
