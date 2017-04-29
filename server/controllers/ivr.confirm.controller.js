var accountSid = 'AC68f869d8679560a1cb6765cce7323c6e';
var authToken = "3168f4089f327e08a72b5858a2ed5b93";
var client = require('twilio')(accountSid, authToken);

//Replace this function with code to retrieve the data from the database given the visitationId
var getData = function(visitationId){
  return {
    "caregiver":{"name":"Tiago Lopes","phone":"8572069305"},
    "parent":{"name":"Jesse Engelberg","phone":"8572069305"},
    "kid":{"name":"Ross Miller"},
    "location":"McDonalds in Venice, at 2457 South Lincoln Boulevard"
  };
}

//Use this function to save the response into the database
var saveResponse = function(role,id,canGo){

}

function startCall(req, res) {
  var data = getData(req.params.id);
    var parent = data[req.params.role];
    client.calls.create({
        url: "https://50bfca81.ngrok.io/call/"+req.params.role+"/"+req.params.visitationId,
        to: "+1"+parent["phone"],
        from: "+13233065929"
    }, function(err, call) {
        process.stdout.write(call.sid);
    });
    res.send("Call started to "+parent.name+" ("+req.params.role+") at "+parent.phone+", id="+req.params.visitationId);
}


function callParent(req, res) {
  var data = getData(req.params.visitationId);

    var xml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
    xml+='<Gather action="/call/confirm/parent/'+req.params.visitationId+'" method="GET" timeout="30" finishOnKey="12" numDigits="1">';
    xml+= '<Say voice="woman">Hello! This call is from the Amazing Foster Care Scheduling System to confirm your visitation with. '+data.kid.name+'. Tomorrow, April 30th, 4 PM. The location is. '+data.location+'</Say>';
    xml+='<Say voice="man">To confirm, press 1. If you cant make it, press 2.</Say>';
    xml+='</Gather>';
    //xml+='<Redirect method="GET"></Redirect>';//Keep bothering until they select an option
    xml+='</Response>';
    res.header('Content-Type','text/xml').send(xml);
}


function callCaregiver(req, res) {
  var data = getData(req.params.visitationId);

  var xml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
  xml+='<Gather action="/call/confirm/caregiver/'+req.params.visitationId+'" method="GET" timeout="30" finishOnKey="12" numDigits="1">';
  xml+= '<Say voice="woman">Hello! This call is from the Amazing Foster Care Scheduling System to confirm the visitation for '+data.kid.name+', with the parent, '+data.parent.name+'. Tomorrow, April 30th, 4 PM. The location is. '+data.location+'</Say>';
  xml+='<Say voice="man">To confirm, press 1. If '+data.kid.name+' cant make it, press 2.</Say>';
  xml+='</Gather>';
  //xml+='<Redirect method="GET"></Redirect>';//Keep bothering until they select an option
  xml+='</Response>';
  res.header('Content-Type','text/xml').send(xml);
}


function confirm(req, res) {
  console.log(req.query);

  saveResponse(req.params.role,req.params.visitationId,req.query.Digits=='1');

  if(req.query.Digits=='1'){
    var xml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
    xml+='<Say voice="man">The visitation is now confirmed! Please let the social worker know if the plans change. Thank you!</Say>';
    xml+='</Response>';
    res.header('Content-Type','text/xml').send(xml);
  }else{
    var xml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
    xml+='<Say voice="man">The visitation is now cancelled, the social worker will contact you to reschedule at a different time. Thank you!</Say>';
    xml+='</Response>';
    res.header('Content-Type','text/xml').send(xml);
  }
}


export default {
  startCall,callParent,callCaregiver,confirm
}
