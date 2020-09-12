console.log("Background runnig");

var ultimaHora = null;
var proximaHora = null;
var ativo = false;
var trocaAba = false;

chrome.alarms.onAlarm.addListener(enviarDadosPagina);
chrome.runtime.onMessage.addListener(enviarDadosPagina);
chrome.tabs.onActivated.addListener(enviarDadosPagina);

function enviarDadosPagina(param){
	if(!ativo){
		console.log("Dashtime desativada!");
		return;
	}
	if(!trocaAba && param.tabId !== undefined){ //Efetuar na troca de aba desativada e é evento de mudança de aba
		console.log("Desativada para troca de abas!");
		return;
	}
	console.log("Enviar evento para a guia atual");
	let params = {
		active: true
	}
	chrome.tabs.query(params, gotTabs);
	var d = new Date();
	var dia = parseInt(d.getDate());
	var mes = parseInt(d.getMonth())+1;
	var ano = d.getFullYear().toString().substr(-2);
	if(dia < 10)
		dia = "0"+d.getDate().toString();
	if(mes < 10)
		mes = "0"+mes.toString();
	function gotTabs(tabs) {
		let dados = {
			action: "updateDates",
			dataAtual: mes.toString()+"/"+dia.toString()+"/"+ano,
			horaAtual: parseInt(d.getHours()),
			diaAtual: dia.toString()
		}
		chrome.tabs.sendMessage(tabs[0].id, dados);
	}
	ultimaHora = "Last update: "+d.toLocaleString();
	chrome.alarms.get("UpdateDateTimeFields", function(alarm){
		let alarmTime = new Date(alarm.scheduledTime);
		console.log("Alarme setado para "+alarmTime.toLocaleString());
		proximaHora = "Next update: "+alarmTime.toLocaleString();
	});
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function msToNextUpdate() {
    return (3600000 - new Date().getTime() % 3600000)+60000;
}