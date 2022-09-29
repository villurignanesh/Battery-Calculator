function getSettings(){
    if (typeof(Storage) !== "undefined") {
      console.log("Web Storage support");
    } else {
      console.log("No Web Storage support");
    }

    if (localStorage.localJSON){
        fillForm(JSON.parse(localStorage.localJSON));
        console.log("restore settings");
    }
    else{
        console.log("no settings stored");
    }
}

function saveSettings(){
    localStorage.localJSON = toJSONString(document.getElementById("form1").elements);
}

function toJSONString( form ) {
	var obj = {};
	var elements = form.querySelectorAll( "input, select, textarea" );
	for( var i = 0; i < elements.length; ++i ) {
		var element = elements[i];
		var name = element.name;
		var value = element.value;

		if( name ) {
			obj[ name ] = value;
		}
	}
	return JSON.stringify( obj );
}

function fillForm( json ){
    var tempJson = json;
    for (var item in tempJson) {
        document.getElementsByName(item)[0].value = tempJson[item];
    }
}

//General Array Function
function MakeArray(n) {
  this.length = n;
  for (var i = 1; i <= n; i++) {
    this[i] = 0;
  }
}

//Day of Week Function
function compute(form) {
    var msph = 3600000;
    
    var capRat = form.capacity.value+form.n_battery.value; 
    var offma = form.sleep_c.value; 
    
    var onms1 = form.wake_t_1.value*form.wake_n_1.value;  
    var onma1 = form.wake_c_1.value; 
    if (onms1>msph)   
        {   onms1=msph;  }  
    
    var onms2 = form.wake_t_2.value*form.wake_n_2.value;  
    var onma2 = form.wake_c_2.value; 
    if (onms2>msph)   
        {   onms2=msph;  }  
        
    var onms3 = form.wake_t_3.value*form.wake_n_3.value;  
    var onma3 = form.wake_c_3.value; 
    if (onms3>msph)   
        {   onms3=msph;  }  
        
    var modRat = capRat*0.85;
    
    var offms = msph-onms1-onms2-onms3;
    
    var realma=((offma*offms)+(onma1*onms1)+(onma2*onms2)+(onma3*onms3))/msph; 
    var lifeda = (modRat/realma)/24; 
    var lifeyr = lifeda/365; 
    
    form.result1.value = Math.round(lifeda)/10;
    form.result2.value = Math.round(lifeyr)/10;
    
    localStorage.localJSON = toJSONString(form);
    window.location.href = "#results";
}

//share the results
function shareResults(){
	console.log("share results");
	var resultJSON = document.getElementById("form1").elements;
	
	var mailbody = "\n";
	mailbody = mailbody + "capacity: "+resultJSON.n_battery.value+" x "+resultJSON.capacity.value+" mAh\n";
	mailbody = mailbody + "sleep current: "+resultJSON.sleep_c.value+" mA\n\n";
	
	mailbody = mailbody + "task 1:\n";
	mailbody = mailbody + "--------------------------\n";
	mailbody = mailbody + "wakeup current: "+resultJSON.wake_c_1.value+" mA\n";
	mailbody = mailbody + "wakeup time: "+resultJSON.wake_t_1.value+" ms\n";
	mailbody = mailbody + "wakeups per hour: "+resultJSON.wake_n_1.value+"\n\n";
	
	mailbody = mailbody + "task 2:\n";
	mailbody = mailbody + "--------------------------\n";
	mailbody = mailbody + "wakeup current: "+resultJSON.wake_c_2.value+" mA\n";
	mailbody = mailbody + "wakeup time: "+resultJSON.wake_t_2.value+" ms\n";
	mailbody = mailbody + "wakeups per hour: "+resultJSON.wake_n_2.value+"\n\n";
	
	mailbody = mailbody + "task 3:\n";
	mailbody = mailbody + "--------------------------\n";
	mailbody = mailbody + "wakeup current: "+resultJSON.wake_c_3.value+" mA\n";
	mailbody = mailbody + "wakeup time: "+resultJSON.wake_t_3.value+" ms\n";
	mailbody = mailbody + "wakeups per hour: "+resultJSON.wake_n_3.value+"\n\n";

	mailbody = mailbody + "\ndays: "+resultJSON.result1.value+"\n";
	mailbody = mailbody + "years: "+resultJSON.result2.value+"\n";

	//alert(mailbody);
	//window.location="mailto:?subject=battery%20life&body="+encodeURIComponent(mailbody);
	
	let shareData = {
			title: 'Battery Life Results',
			url: 'https://variablo87.github.io/batterycalc/',
			text: mailbody,
			}
	
	if (navigator.share) {
		navigator.share(shareData)	
	} else {
		// fallback
		window.location="mailto:?subject=battery%20life&body="+encodeURIComponent(mailbody);
	}
	
	

}
         // end script -->
