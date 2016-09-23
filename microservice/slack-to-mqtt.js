module['exports'] = function echoHttp (hook) {
  	console.log(hook.params);
  
  	var mqtt = require('mqtt');
  
  	const access_token = "<<your slack webhook access token>>";
  	const incoming_token = hook.params["token"];
   
  	var retJson = {};
  	var text = hook.params["text"].replace("respeaker,", "").trim();
  
  	if(access_token === incoming_token){
		retJson = {
			"text": "Received"	
    	};
      
      	var client  = mqtt.connect('mqtt://iot.eclipse.org');
 
		client.on('connect', function () {
          	var mqttMessage = {
              	"user_name": hook.params["user_name"],
              	"channel": hook.params["channel"],
              	"team": hook.params["team_domain"],
              	"text": text
            };
  			client.publish('respeaker/slack/text', JSON.stringify(mqttMessage, true, 2));
          
          	client.end();
          
          	hook.res.end(JSON.stringify(retJson, true, 2));
		});
  	}
  	else{
      	retJson = {
			"text": "Invalid token received, there should be someting wrong."	
    	};
      
      	hook.res.end(JSON.stringify(retJson, true, 2));
    }
};