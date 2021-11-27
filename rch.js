function IMPiViewModel() {
	var self = this;
	
	self.jobname = ko.observable('Job 1');
	self.description_rch = ko.observable('');
	
	self.network_rch = ko.observable();
	self.network_files_rch = ko.observable();
	
	self.network_option = ko.observable("select");
	self.networks = ko.observableArray([])
	self.selectedNetworks=ko.observableArray();
	
	self.email_notification_rch = ko.observable("no");
	
	self.chosenNetworks = ko.observableArray([])
	
	self.selectedOption = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption(); 
    });
    
    self.disable_upload = ko.observable(true);
    self.disable_select = ko.observable(false);
    
    $.ajax({
	    url: "/api/mdtask/jobs",
	    success: function(data) {
			var array = [];
            $.each(data, function (index, job) {
                if(job.Status_ID == "14") {
			        //array.push(job.Job_Name);
			        array.push(
			            {
			            name: job.Job_Name,
			            iden: job.Job_ID
			            }
			        );
		        }
            });
            self.networks(array);
		},
		error: function(http) {
			$("#error_heading").html("Error loading jobs");
		},
        cache: false,
        contentType: false,
        processData: false
	});
    
	self.start_job_rch = function() {
		if(site.User())
		{
    	    try
            {
    			$("#rch_input").hide();
    			$("#loading_rch").show();
    			
    			var form = $("form#rch-form")
        		var formData = new FormData(form[0]);
        		
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#rch_input").show();
    			    $("#loading_rch").hide();
    		        return;
    		    }
    		    
    		    if(self.network_option() == "select")
    		    {
    		        // For each selected job 
    		        var array = [];
    		        formData.append('network_rch', ko.toJSON(self.chosenNetworks()));
    		    }
    		    else 
    		    {
    		        console.log(ko.toJSON(self.network_files_rch()));
    		        formData.append('network_rch', ko.toJSON(self.network_rch()));
    		    }
    		    
    		    formData.append('description_rch', self.description_rch());
    		    formData.append('email_notification_rch', self.email_notification_rch());
    		    
    		    /* Add validation back at a later stage
    		    if(self.network_files_rch() == null){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Please provide at least two network files");
        			$("#errorModal").modal('show');
        				
    		        $("#rch_input").show();
    			    $("#loading_rch").hide();
    		        return;
    		    }*/
                
        		$.ajax({
        		    url: "/api/mdtask/jobs/rch",
        		    type: "POST",
        		    data: formData,
        		    success: function(id) {
        				job.getJobs()
        			    window.location = "/#jobs/" + id
        			},
        			error: function(http) {
        				$("#error_heading").html("Error running MD-TASK");
        				console.log(self.chosenNetworks().length);
        				if (self.chosenNetworks().length <= 1) {
        				    $("#error_content").text("Please select at least two networks to compare.");
        				}
        				else if(http.status == 400) {
        				    $("#error_content").text(http.responseText);
        				} else {
        				    $("#error_content").text("An error occured when attempting to run the job. Please select previously run contact map files.");
        				}
        				
        				$("#errorModal").modal('show');
        				$("#rch_input").show();
        				$("#loading_rch").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#rch_input").show();
				$("#loading_rch").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
	self.network_option.subscribe(function() {
        if(self.network_option() == "upload")
	    {
	        self.disable_upload(false);
            self.disable_select(true);
	    }
        else
	    {
	        $.ajax({
    		    url: "/api/mdtask/jobs",
    		    success: function(data) {
    				var array = [];
                    $.each(data, function (index, job) {
                        if(job.Status_ID == "14") {
        			        //array.push(job.Job_Name);
        			        array.push(
        			            {
        			            name: job.Job_Name,
        			            iden: job.Job_ID
        			            }
        			        );
    			        }
                    });
                    self.networks(array);
    			},
    			error: function(http) {
    				$("#error_heading").html("Error loading jobs");
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
            
    		self.disable_upload(true);
            self.disable_select(false);
	    }
    });
    
	function validateJobName(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
    function validateNetwork(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
}

var changeTrajectoryDiv_rch = function(div) {
	if(div == "upload") {
		$("#upload_networks_rch").addClass('panel-info');
		$("#select_networks_rch").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_networks_rch").removeClass('panel-info');
		$("#select_networks_rch").addClass('panel-info');
	}
}

$('.selectable_div').click(function() {
    $(this).find('input:radio')[0].click();
});

function clearAutoModel() {
	autoModelViewModel.clearAutoModel();
}

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("rch"));