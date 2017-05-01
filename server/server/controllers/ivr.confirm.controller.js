import Visitation from '../models/visitation.model'
import twilio from 'twilio'
import Promise from 'bluebird'
import util from 'util'
import moment from 'moment'

var accountSid = 'AC68f869d8679560a1cb6765cce7323c6e'
var authToken = '3168f4089f327e08a72b5858a2ed5b93'
var client = twilio(accountSid, authToken)

var copy = {
  intro:{
    "en":'Reunite would like to confirm your visitation with. {kid}. {time}. The location is. {location}',
    "es":'Reunite desea confirmar su visitacion con. {kid}. {time}. El lugar es. {location}'
  },
  toconfirm:{
    "en":'To confirm, press 1. If you cant make it, press 2.',
    "es":'Para confirmar, oprima 1. Si no puede hacerla, oprima 2.'
  },
  confirmed:{
    "en":'The visitation is now confirmed! Please let the social worker know if the plans change. Thank you!',
    "es":'La visitacion está confirmada! Por favor, informe al trabajador social si los planes cambian. Gracias!'
  },
  cancelled:{
    "en":'The visitation is now cancelled, the social worker will contact you to reschedule at a different time. Thank you!',
    "es":'La visita está cancelada, el trabajador social se pondrá en contacto con usted para reprogramar en otro momento. ¡Gracias!'
  }
}

//Replace this function with code to retrieve the data from the database given the visitationId
function getData(visitationId) {
  return Visitation.getResponse(visitationId)
  .then((visitation) => {
    return {
      caregiver: visitation.caregiver,
      parent: visitation.parent,
      child: visitation.child,
      location: visitation.location
    }
  })
}

//Use this function to save the response into the database
var saveResponse = function(role,id,canGo){

}

function startCall(req, res) {
  getData(req.params.visitationId)
  .then((visitation) => {
    //let role = visitation[req.params.role]
    const parent = visitation.parent
    return Promise.try(() => client.calls.create({
      url: 'http://ec2-34-208-196-65.us-west-2.compute.amazonaws.com:4040/api/call/language/parent/' + req.params.visitationId,
      to: parent.mobileNumber,
      from: "+13233065929"
    })
    .then((call) => {
      let parent = visitation.parent
      //console.log('$$$$$$$$$$ CALL STARTED $$$$$$$$$$$$$$$$$$$')
      res.send('Call started to ' + parent.name + '(' + req.params.role + ') at ' + parent.mobileNumber + ', id=' + req.params.visitationId);
    })
    .catch((reason) => {
      console.log('REASON: ' + util.inspect(reason))
    }))
  })
}

function selectLanguage(req, res) {
  var data = getData(req.params.visitationId);

  var xml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
  xml+='<Gather action="/api/call/setlanguage/'+req.params.role+'/'+req.params.visitationId+'" method="GET" timeout="30" finishOnKey="12" numDigits="1">';
  xml+= '<Say voice="woman">Hello! This call is from Reunite</Say>';
  xml+='<Say voice="man">For English, press 1.</Say>';
  xml+='<Say voice="man" language="es">Para español, oprima el 2.</Say>';
  xml+='</Gather>';
  //xml+='<Redirect method="GET"></Redirect>';//Keep bothering until they select an option
  xml+='</Response>';
  res.header('Content-Type','text/xml').send(xml);
}

function setLanguage(req, res) {
  if(req.query.Digits=='1'){
    var xml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
    xml+='<Redirect method="POST">/api/call/en/'+req.params.role+'/'+req.params.visitationId+'</Redirect>';
    xml+='</Response>';
    res.header('Content-Type','text/xml').send(xml);
  }else{
    var xml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
    xml+='<Redirect method="POST">/api/call/es/'+req.params.role+'/'+req.params.visitationId+'</Redirect>';
    xml+='</Response>';
    res.header('Content-Type','text/xml').send(xml);
  }
}


function callPerson(req, res) {
  //console.log('$$$$$$$$$$ callParent $$$$$$$$$$$$$$$$$$$')
  getData(req.params.visitationId)
  .then((visitation) => {
    var parsedDateTime = moment(visitation.datetime)
    var xml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
    xml+='<Gather action="http://ec2-34-208-196-65.us-west-2.compute.amazonaws.com:4040/api/call/'+req.params.language+'/confirm/' +req.params.role+'/'+req.params.visitationId+'" method="POST" timeout="30" finishOnKey="12" numDigits="1">';
    xml+= '<Say voice="woman" language="'+req.params.language+'">'+copy.intro[req.params.language].replace("{kid}",visitation.child.name).replace("{location}",visitation.location).replace("{time}",parsedDateTime.format('LLL'))+'</Say>';
    xml+='<Say voice="man" language="'+req.params.language+'">'+copy.toconfirm[req.params.language]+'</Say>';
    xml+='</Gather>';
    //xml+='<Redirect method="GET"></Redirect>';//Keep bothering until they select an option
    xml+='</Response>';
    res.header('Content-Type','text/xml').send(xml);
  })
}




function confirm(req, res) {
  saveResponse(req.params.role,req.params.visitationId,req.body.Digits == '1');

  if(req.body.Digits == '1'){
    var xml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
    xml+='<Say voice="man" language="'+req.params.language+'">'+copy.confirmed[req.params.language]+'</Say>';
    xml+='</Response>';
    res.header('Content-Type','text/xml').send(xml);
  }else{
    var xml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
    xml+='<Say voice="man" language="'+req.params.language+'">'+copy.cancelled[req.params.language]+'</Say>';
    xml+='</Response>';
    res.header('Content-Type','text/xml').send(xml);
  }
}


export default {
  startCall,selectLanguage,setLanguage,callPerson,confirm
}
