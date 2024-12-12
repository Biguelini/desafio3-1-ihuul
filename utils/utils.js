const { DateTime } = require('luxon');

function nomeValido(nome) {
	return nome.length >= 5;
}

function dataFormatoValido(dataNascimento) {
	const data = DateTime.fromFormat(dataNascimento, "dd/MM/yyyy");
	if (!data.isValid) {
		return false;
	}
	return true;
}

function validarCPF(cpf) {
	cpf = cpf.replace(/\D/g, "");

	if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
		return false;
	}

	let soma = 0;
	for (let i = 0; i < 9; i++) {
		soma += parseInt(cpf[i]) * (10 - i);
	}
	let primeiroDigito = (soma * 10) % 11;
	if (primeiroDigito === 10) primeiroDigito = 0;

	if (primeiroDigito !== parseInt(cpf[9])) {
		return false;
	}

	soma = 0;
	for (let i = 0; i < 10; i++) {
		soma += parseInt(cpf[i]) * (11 - i);
	}
	let segundoDigito = (soma * 10) % 11;
	if (segundoDigito === 10) segundoDigito = 0;

	return segundoDigito === parseInt(cpf[10]);
}


function calcularIdade(dataNascimento) {
	const data = DateTime.fromFormat(dataNascimento, "dd/MM/yyyy");
	return DateTime.now().diff(data, 'years').years;
}

function validarHorario(dataConsulta, horaInicial, horaFinal) {
	const inicio = DateTime.fromFormat(`${dataConsulta} ${horaInicial}`, "dd/MM/yyyy HHmm");
	const fim = DateTime.fromFormat(`${dataConsulta} ${horaFinal}`, "dd/MM/yyyy HHmm");

	return (
		inicio < fim &&
		inicio.hour >= 8 && fim.hour <= 19
	);
}

function horaValida(hora) {
	const match = hora.match(/^([01]\d|2[0-3])[0-5]\d$/);
	if (!match) return false;

	const minutos = parseInt(hora.slice(-2), 10);
	return minutos % 15 === 0;
}

module.exports = { nomeValido, dataFormatoValido, validarCPF, calcularIdade, validarHorario, horaValida };