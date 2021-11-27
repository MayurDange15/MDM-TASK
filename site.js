navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

function SiteViewModel() {
	//Data
	var self = this;
	self.Title = ko.observable();
	self.CurrentPage = ko.observable("none");
	self.action = ko.observable();
	self.id = ko.observable();
	self.PageHeading = ko.observable();
	self.PageIcon = ko.observable();
	self.User = ko.observable();
	self.Jobs = ko.observableArray();
	self.Title("MD-TASK");	
}
	
var site = new SiteViewModel()
ko.applyBindings(site, document.getElementById("top"));

var access_rights = ["Owner", "Admin", "View & Comment", "View"];

function addTab(tab, id, name) {
	$("#" + tab + " ul").append(
		"<li id='li" + id + "'><a href='#tab" + id + "'>" + name + "</a></li>"
	);
	$("#" + tab).append(
		"<div id='tab" + id + "' style='overflow:hidden'></div>"
	);
	$("#" + tab).tabs("refresh");
}

function viewProfile() {
	window.location = '#profile'
}
			
var authButton = function() {
	$('#helpModal').modal('show');
	
}

var auth_callback = null;
var login = function() {

    
    $("#login_error").text("");
    $("#login_success").text("");
	
	user = $("#login_username").val();
	passwd = $("#login_password").val();
	
	loginUser(user, passwd, auth_callback);
}

var loginUser = function(user, passwd, callback) {
	startLoad("signin_form", "signin_loading");
	
	$.ajax({
		url: "/api/users/login",
		type: "POST",
		data: { username: user, password: passwd },
		success: function(result) {
			site.User(new User(result.date_joined, result.email, result.first_name, result.id, result.last_login, result.last_name, result.username));
			handleLogin(site.User(), callback);
			location.reload();
		},
		error: function(a, b, c) {
			$("#login_error").text("Incorrect username or password");
			$("#login_success").text("");
		},
		complete: function() {
		    stopLoad("signin_form", "signin_loading");
		}
	});
}

var interval = null;
var handleLogin = function(user, callback) {
    $("#login_error").text("");
    $("#login_success").text("");
    
	setupAjax();
	job.getJobs();
	profile.getUser();
	
	if (callback && (typeof callback == "function")) {
		callback();
	}
	
	auth_callback = null;
	
	interval = window.setInterval(function () { 
		job.getJobs(); 
	}, 15000);
	
	
	$("#user_buttons").show();
	if(user.first_name.length == 0)
		$("#user").text(user.username);
	else
		$("#user").text(user.first_name);
	
	$(".file_menu").css("width", $("#user_buttons").width() + "px");
	
	$("#authBtn").removeClass("btn-metis-2");	
	$("#authBtn").addClass("btn-metis-1");
	$("#authBtn").tooltip( "option", "content", "Logout" );	
	$("#authBtn").attr("onclick","logout()");
	
	$('#helpModal').modal('hide')	
}
	
var logout = function() {
    $("#login_error").text("");
    $("#login_success").text("");
    
	$.ajax({
		url: "/api/users/logout",
		success: function(result) {
			handleLogout();
		},
		error: function(a, b, c) {
			alert("Logout failed");
		}
	});
}

var handleLogout = function() {
	clearInterval(interval);
	setupAjax();
	
	$("#user_buttons").hide();
	$("#authBtn").removeClass("btn-metis-1");
	$("#authBtn").addClass("btn-metis-2");
	$("#authBtn").attr("onclick","authButton()");
	$("#authBtn").tooltip( "option", "content", "Login" );
	
	site.User(null);
	
	if($.inArray(site.CurrentPage(), ["jobs", "profile"]) >= 0) {
		window.location = "/#home";
	}
}

var token = null	
var recover = function() {
    $("#login_error").text("");
    $("#login_success").text("");
    
	startLoad("recover", "recover_loading")
	
	email = $("#recovery_email").val();
	
	$("#code").val("");
	$("#new_password").val("");
	$("#confirm_new_password").val("");
	
	$.ajax({
		url: "/api/users/reset",
		type: "POST",
		data: email,
		success: function(data) {
		    token = data;
		    
		    $("#code").val("");
	        $("#new_password").val("");
            $("#confirm_new_password").val(""); 
            
			$('#reset_password').trigger('click');
		},
		error: function(http){
			$("#login_error").text(http.responseText.replace(/^"(.*)"$/, '$1'));
		}, complete: function() {
		    stopLoad("recover", "recover_loading")
		}
	});
}

var reset_password = function() {
    $("#login_error").text("");
    $("#login_success").text("");
	
    var data = new Object()
    data.reset_code = $("#code").val();
    data.reset_token = token;
    data.password = $("#new_password").val();
    
    if(data.password == $("#confirm_new_password").val()) {
    
	    startLoad("reset_form", "reset_loading")
        
        $.ajax({
    		url: "/api/users/reset",
    		type: "PUT",
    		data: JSON.stringify(data),
    		success: function(result) {
    		    token = null;
    		    
			    $('#login_link').trigger('click');
			    
			    $("#login_success").text("Password was successfully reset");
			    
            	$("#login_username").val("");
	            $("#login_password").val("");
    		},
    		error: function(http){
    			$("#login_error").text(http.responseText.replace(/^"(.*)"$/, '$1'));
    		}, 
    		complete: function() {
    		    stopLoad("reset_form", "reset_loading")
    		}
    	});
    	
    } else {
        $("#login_error").text("Passwords do not match")
    }
}
	
var register = function() {
    $("#login_error").text("");
    $("#login_success").text("");
    
	user = $("#register_username").val();
	email = $("#register_email").val();
	passwd = $("#register_password").val();
	conf = $("#confirm_password").val();
	
	startLoad("signup_form", "signup_loading");
	
	if(conf == passwd) {
		$.ajax({
			url: "/api/users/",
			type: "POST",
			data: { username: user, password: passwd, email: email },
			success: function(result) {
				loginUser(user, passwd);
				$("#login_error").text("");
				$("#login_success").text("");
			},
			error: function(http) {
				$("#login_error").text("Registration failed. " + http.responseText);
				$("#login_success").text("");
			}, 
			complete: function() {
    		    stopLoad("signup_form", "signup_loading")
    		}
		});
	}
	else
	{
		$("#login_error").text("Passwords do not match");
	}
}


function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
		    var cookie = jQuery.trim(cookies[i]);
		    // Does this cookie string begin with the name we want?
		    if (cookie.substring(0, name.length + 1) == (name + '=')) {
		        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		        break;
		    }
		}
	}
	return cookieValue;
}
		
var csrftoken;
		
function csrfSafeMethod(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
		
function sameOrigin(url) {
	// test that a given url is a same-origin URL
	// url could be relative or scheme relative or absolute
	var host = document.location.host; // host + port
	var protocol = document.location.protocol;
	var sr_origin = '//' + host;
	var origin = protocol + sr_origin;
	// Allow absolute or scheme relative URLs to same origin
	return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
		(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
}
		
function setupAjax() {
	csrftoken = getCookie('csrftoken');
	
	$.ajaxSetup({
		beforeSend: function(xhr, settings) {
			if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
				// Send the token to same-origin, relative URLs only.
				// Send the token only if the method warrants CSRF protection
				// Using the CSRFToken value acquired earlier
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		}
	});
}

function destroyTable(table_name) {	
			
	table = $("#" + table_name)
	body = table.children('tbody');
			
	table.dataTable().fnDestroy();
	body.html("");				
			
}	
		
function createTable(table_name, sort_by) {
			
	sort_by = sort_by || 0;
	
	table = $("#" + table_name)
	body = table.children('tbody');
			
	var dt = table.dataTable({
		"sDom": "<'pull-right'l>t<'row'<'col-lg-6'f><'col-lg-6'p>>",
		"sPaginationType": "bootstrap",
		"oLanguage": {
			"sLengthMenu": "Show _MENU_ entries"
		},
		"aaSorting": [[ sort_by, "asc" ]]
	});	
					
	table.css("width","100%");	
	
	return dt;
}

function startLoad(content_div_id, loading_div_id) {
	$("#" + content_div_id).hide();
	$("#" + loading_div_id).show();
}

function stopLoad(content_div_id, loading_div_id) {
	$("#" + loading_div_id).hide();
	$("#" + content_div_id).show();
}

function askQuestion(question, detail, yes_function) {
	$("#questionModal").modal('show');
	$("#question_heading").text(question);
	$("#question_content").text(detail);
	$("#yes_btn").click(function() {
		yes_function();
	});
}

$(function() {
	$('#helpModal').on('hide.bs.modal', function () {
		auth_callback = null;
	});
		
	$('.tagsinput').tagsInput({
	    'defaultText':'Specify PDB IDs and chains using the following format: ID:chain e.g. 4HHB:A 2HHB:C',
		'delimiters': [";", ",", " "]		
	});
	$('.tagsinput').width("100%");
	
	
	$("#job_tabs").tabs();
	$("#user_tabs").tabs();
    
	$('.slimScroll').slimScroll({
        height: '900px',
        wheelStep : 5,
        touchScrollStep : 50
    });
    
    $('.slimScrollMessages').slimScroll({
        height: '450px',
        start: 'bottom'
    });
	
	$("#job_menu").hover(
	  	function () {
		 	$(this).find('.file_menu').show();
	  	}, 
	  	function () {
		 	$(this).find('.file_menu').hide();
	  	}
	);
	
		
	$('a[href=#]').on('click', function (e) {
    	e.preventDefault();
	});
    		
	$('a[data-toggle=tooltip]').tooltip();
	$('a[data-tooltip=tooltip]').tooltip();

	$('a.minimize-box').on('click', function (e) {
		e.preventDefault();
		var $icon = $(this).children('i');
				
		if ($icon.hasClass('fa-minus')) {
		    $icon.removeClass('fa-minus').addClass('fa-spinner fa-spin');
		    setTimeout(function() {
		  		$icon.removeClass('fa-spinner fa-spin').addClass('fa-plus');
			}, 500);
		} else if ($icon.hasClass('fa-plus')) {
		    $icon.removeClass('fa-plus').addClass('fa-spinner fa-spin');
		    setTimeout(function() {
		  		$icon.removeClass('fa-spinner fa-spin').addClass('fa-minus');
			}, 500);
		}
	});   
    
	$('#changeSidebarPos').on('click', function (e) {
		$('body').toggleClass('hide-sidebar');
		$('#content').toggleClass('content');
	});
    		
    		
	$('.list-inline li a').on('click', function() {
		var activeForm = $(this).attr('href') + ' form';
				
		$(activeForm).addClass('magictime swap');
		//set timer to 1 seconds, after that, unload the magic animation
		setTimeout(function() {
		  	$(activeForm).removeClass('magictime swap');
		}, 1000);
	});
    		
});

(function ($, window, document, undefined) {
	
	var pluginName = "metisMenu",
		defaults = {
		    toggle: true
		};
				
	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Plugin.prototype = {
		init: function () {

		    var $this = $(this.element),
		        $toggle = this.settings.toggle;

		    $this.find('li.active').has('ul').children('ul').addClass('collapse in');
		    $this.find('li').not('.active').has('ul').children('ul').addClass('collapse');

		    $this.find('li').has('ul').children('a').on('click', function (e) {
		        e.preventDefault();

		        $(this).parent('li').toggleClass('active').children('ul').collapse('toggle');

		        if ($toggle) {
		            $(this).parent('li').siblings().removeClass('active').children('ul.in').collapse('hide');
		        }
		    });
		}
	};

	$.fn[ pluginName ] = function (options) {
		return this.each(function () {
		    if (!$.data(this, "plugin_" + pluginName)) {
		        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
		    }
		});
	};

})(jQuery, window, document);

var User = function(date_joined, email, first_name, id, last_login, last_name, username) {
	this.date_joined = date_joined;
	this.email = email;
	this.first_name = first_name;
	this.last_name = last_name;
	this.id = id;
	this.last_login = last_login;
	this.username = username;
	this.name = first_name + " " + last_name;
}

$(document).ready(function(){
	  $('[data-toggle="tooltip"]').tooltip({ track:true});
});