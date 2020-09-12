console.log("AppDynamics Dashtime!");

//var search = document.getElementsByClassName('gLFyf gsfi');

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
	if(message.action == "updateDates"){
		console.log("Troca de horários pela Dashtime");
	}else{
		console.log("Ação não será efetuada");
		return;
	}
	console.log("Aplicando tempos corretos!");
	let startDate = document.querySelectorAll('[id^=datefield]').item(7); //Pega o input de texto data inicio
	let endDate = document.querySelectorAll('[id^=datefield]').item(15); //Pega o input de texto data final
	startDate.value = message.dataAtual; //Seta o valor calculado no background script
	endDate.value = message.dataAtual; //Seta o valor calculado no background script
	let datePick = document.getElementsByClassName("x-datepicker-date"); //Atribui os dois datepickers
	for(date of datePick){ //Itera e define nos dois campos o dia atual
		if(date.innerText == message.diaAtual+"Today")
			date.click();
	}
	let times = document.getElementsByClassName("x-form-time-trigger"); //Pega o elemento da dropbox
	times[0].click(); //Expande a dropbox do tempo inicial
	sleep(20);
	let timePick = document.getElementsByClassName("x-boundlist-item"); //Pega os elementos de horario
	console.log(timePick.lenght);
	sleep(20);
	timePick[0].click(); //Clica no index 0 que são 12:00 AM
	sleep(20);
	times[1].click(); //Expande a dropbox do tempo final
	sleep(20);
	timePick = document.getElementsByClassName("x-boundlist-item"); //Atribui os elementos de horario do outro dropbox
	console.log(timePick.lenght);
	sleep(20);
	let index = 25 + message.horaAtual; //25 = 24 do boundlist anterior e 1 para aumentar uma hora
	timePick[index].click(); //Clica no index pegando o horario atual + 1 para ter o horario atual completo
	sleep(20);

	let applyButton = document.querySelectorAll('[title^="Apply Custom Time Range"]').item(0); //Pega o botão para aplicar os horários
	applyButton.click();
}

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
		  break;
		}
	}
}