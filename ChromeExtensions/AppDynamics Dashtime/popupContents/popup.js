var background = chrome.extension.getBackgroundPage();
let ckBoxTrocaAba = document.getElementById('trocaAbaCkBox');
ckBoxTrocaAba.checked = background.trocaAba;
let botaoInicio = document.getElementById('iniciar');
let botaoAtualizar = document.getElementById('atualizar');
let last = document.getElementById('ultimoHorario');
let next = document.getElementById('proximoHorario');
if(background.ultimaHora != null)
	last.innerHTML = background.ultimaHora.toString();
if(background.proximaHora != null)
	next.innerHTML = background.proximaHora.toString();
if(background.ativo)
	botaoInicio.innerHTML = "Desativar";
else
	botaoInicio.innerHTML = "Ativar";
var d = new Date();
messageField = document.getElementById('msg');
messageField.value = "";
botaoAtualizar.addEventListener('click', updateFields);
botaoInicio.addEventListener('click', full);

function full(){
	backgroundSet();
	iniciarAlarme();
	updateFields();
}

function update() {
	
}

function updateFields() {
	background.trocaAba = ckBoxTrocaAba.checked;
	let dados = {
		action: "changeFields"
	}
	if(background.ativo){
		chrome.runtime.sendMessage(dados);
		background.ultimaHora = "Last update: "+d.toLocaleString();
		last.innerHTML = background.ultimaHora;
		messageField.innerHTML = "";
	}else{
		messageField.innerHTML = "Extensão desativada";
	}
}

function iniciarAlarme() {
	let proximoUpdate = Date.now() + msToNextUpdate();
	chrome.alarms.clearAll();
	if(!background.ativo){
		console.log("AppDash Time desativada!");
		background.ultimaHora = null;
		background.proximaHora = null;
		last.innerHTML = background.ultimaHora;
		next.innerHTML = background.proximaHora;
		return;
	}
	alarmInfo = {
		when: proximoUpdate,
		periodInMinutes: 60
	}
	let alarmName = "UpdateDateTimeFields";
	chrome.alarms.create(alarmName, alarmInfo);
	chrome.alarms.get(alarmName, function(alarm){
		let alarmTime = new Date(alarm.scheduledTime);
		console.log("Alarme setado para "+alarmTime.toLocaleString());
		background.proximaHora = "Next update: "+alarmTime.toLocaleString();
		next.innerHTML = background.proximaHora;
	});
}

function backgroundSet(){
	//seta as variavel do script de background para não perder o valor nos campos do popup
	background.trocaAba = ckBoxTrocaAba.checked;
	nomeBotao();
}

function nomeBotao() {
	if(!background.ativo){
		botaoInicio.innerHTML = "Desativar";
		background.ativo = true;
	}else{
		botaoInicio.innerHTML = "Ativar";
		background.ativo = false;
		background.trocaAba = false;
		ckBoxTrocaAba.checked = false;
	}
}

function msToNextUpdate() {
    return (3600000 - new Date().getTime() % 3600000)+60000;
}