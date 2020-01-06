//index.js  


function sendEmail() {
	var name = document.getElementById("user_name").value;
	var email = document.getElementById("user_email").value;
	var subject = document.getElementById("email_subject").value;
	var message = document.getElementById("email_message").value;

	if(name == "" || email == "" || subject == "" || message == ""){
		alert("Please Enter All Fields");
  		return false;  
	}

	if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
	    alert("You have entered an invalid email address!")
	    return false;
	}
	Email.send({
		SecureToken : "abae7717-9f5f-4399-9ad5-8d959de2b0c1",	    
	    To : 'victorpham1997@gmail.com',
	    From : "victorpham1997@gmail.com",
	    Subject : "New message from " + name +" @" + email,
	    Body : 	"Sender name: " + name +"|"
	    	+	"Sender email: " + email +"|"
	    	+	"Subject: " + subject +"|"
	    	+	"message: " + message
	}).then(
	  message => alert("Thank you for contacting me! I will reply you shortly. :)")
	);
}


