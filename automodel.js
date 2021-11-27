function IMPiViewModel() {
	var self = this;
	
	self.jobname = ko.observable('Job 1');
	self.description = ko.observable('');
	
	self.topology = ko.observable();
	self.trajectory_option = ko.observable("upload");
	self.trajectories = ko.observableArray([])
	self.trajectory_bcl = ko.observable();
	self.traj_url_bcl = ko.observable();
	self.threshold = ko.observable("7");
	self.step = ko.observable("100");
	self.measurement_bcl = ko.observable("bc");
	
	self.katz_bcl = ko.observable(false);
	self.dc_bcl = ko.observable(false);
	self.cc_bcl = ko.observable(false);
	self.ecc_bcl = ko.observable(false);
	self.ec_bcl = ko.observable(false);
	self.pr_bcl = ko.observable(false);
	
	self.email_notification_bcl = ko.observable("no");
    
	self.selectedOption = ko.observable();
	self.selectedText =  ko.computed(function () { 
        return self.selectedOption(); 
    });
    self.disable_upload = ko.observable(false);
    self.disable_url = ko.observable(true);
    self.disable_select = ko.observable(true);
    
	self.start_job = function() {
		if(site.User())
		{
    	    try
            {
    			$("#bcl_input").hide();
    			$("#loading_bcl").show();
    			
    			var form = $("form#bcl-form")
    			
    			var em = false;
    			if(self.email_notification_bcl() == "yes") {
    			    em = true;
    			}
			    
        		var formData = new FormData(form[0]);
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#bcl_input").show();
    			    $("#loading_bcl").hide();
    		        return;
    		    }
    		    
    		    formData.append('topology', ko.toJSON(self.topology()));
    		    
    		    if(self.trajectory_option() == "upload")
    		    {
    		        formData.append('trajectory_bcl', ko.toJSON(self.trajectory_bcl()));
    		    }
    		    else if(self.trajectory_option() == "url")
    		    {
    		        formData.append('trajectory_bcl', self.traj_url_bcl());
    		    }
    		    else
    		    {
    		        formData.append('trajectory_bcl', self.selectedOption());
    		    }
    		    
    		    formData.append('threshold', self.threshold());
    		    formData.append('step', self.step());
    		    formData.append('measurement', self.measurement_bcl());
    		    
    		    formData.append('description', self.description());
    		    formData.append('email_notification_bcl', em);
                
        		$.ajax({
        		    url: "/api/mdtask/jobs",
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
        				$("#automodel_input").show();
        				$("#loading_automodel").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#bcl_input").show();
				$("#loading_bcl").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
	self.start_example_job = function() {
		if(site.User())
		{
    	    try
            {
    			$("#bcl_input").hide();
    			$("#loading_bcl").show();
    			
    			var form = $("form#bcl-form")
    			
    			var em = false;
    			if(self.email_notification_bcl() == "yes") {
    			    em = true;
    			}
			    
        		var formData = new FormData(form[0]);
    		    formData.append('jobname', self.jobname());
    		    if(!validateJobName(self.jobname())){
    		        $("#error_heading").html("Input Error");
        			$("#error_content").text("Job name contains incorrect characters");
        			$("#errorModal").modal('show');
        				
    		        $("#bcl_input").show();
    			    $("#loading_bcl").hide();
    		        return;
    		    }
    		    
    		    formData.append('topology', "sample_job");
    		    
    		    formData.append('threshold', self.threshold());
    		    formData.append('step', self.step());
    		    formData.append('measurement', self.measurement_bcl());
    		    
    		    formData.append('description', self.description());
    		    formData.append('email_notification_bcl', em);
                
        		$.ajax({
        		    url: "/api/mdtask/jobs",
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
        				$("#automodel_input").show();
        				$("#loading_automodel").hide();
        			},
                    cache: false,
                    contentType: false,
                    processData: false
        		});
        	
            } catch(err) {
                $("#error_heading").html("Error running MD-TASK");
				$("#error_content").text(err);
				
				$("#errorModal").modal('show');
				$("#bcl_input").show();
				$("#loading_bcl").hide(); 
            }
		}
		else
		{
			$('#helpModal').modal('show');
			auth_callback = function() { self.model(); }
		}
	}
	
    self.trajectory_option.subscribe(function() {
        if(self.trajectory_option() == "upload")
	    {
	        self.disable_upload(false);
            self.disable_url(true);
            self.disable_select(true);
	    }
	    else if(self.trajectory_option() == "url")
	    {
	        self.disable_upload(true);
            self.disable_url(false);
            self.disable_select(true);
	    }
        else
	    {
            $.ajax({
    		    url: "/api/datastore/trajectories/",
    		    type: "POST",
    		    //data: formData,
    		    success: function(data) {
    				var array = [];
                    $.each(data, function (index, value) {
                        array.push(value);
                    });
                    self.trajectories(array);
                    console.log(self.trajectories());
    			},
    			error: function(http) {
    				$("#error_heading").html("Error loading trajectories");
    			},
                cache: false,
                contentType: false,
                processData: false
    		});
    		self.disable_upload(true);
            self.disable_url(true);
            self.disable_select(false);
	    }
    });
    
	function validateJobName(name) {
    	return /^[a-z0-9 _.-]+$/i.test(name);
    }
	
	self.clearAutoModel = function() {
		self.jobname();
    	self.sequence('');
    	self.description('');
    	
    	self.template_option("automatic");
    	self.method("blast")
    	self.manual_template(false);
    	self.templates([new Template(null, "A", "True")]);
    	
    	self.alignment_option("automatic");
    	self.alignment_program("t-coffee");
    	self.alignment_mode("pspresso");
    	self.manual_alignment(false);	
    	self.alignment();
    	
    	self.num_models("60");
    	self.refinement_method("very_slow");
			
		showTemplateDiv("automatic");	
		showAlignmentDiv("automatic");
		showModeDiv("t-coffee");
	
		$("#bcl_input").show();
		$("#loading_bcl").hide();
	}
}

var changeTrajectoryDiv_bcl = function(div) {
	if(div == "upload") {
		$("#upload_trajectory_bcl").addClass('panel-info');
		$("#url_trajectory_bcl").removeClass('panel-info');
		$("#select_trajectory_bcl").removeClass('panel-info');
	}
	else if(div == "url") {
		$("#upload_trajectory_bcl").removeClass('panel-info');
		$("#url_trajectory_bcl").addClass('panel-info');
		$("#select_trajectory_bcl").removeClass('panel-info');
	}
	else if(div == "select") {
		$("#upload_trajectory_bcl").removeClass('panel-info');
		$("#url_trajectory_bcl").removeClass('panel-info');
		$("#select_trajectory_bcl").addClass('panel-info');
	}
}

$('.selectable_div').click(function() {
    $(this).find('input:radio')[0].click();
});

function clearAutoModel() {
	autoModelViewModel.clearAutoModel();
}

var impi = new IMPiViewModel();
ko.applyBindings(impi, document.getElementById("bcl"));