const { DateTime } = require('luxon');
var Table = require('cli-tableau');
const { Paciente } = require('../models/Paciente');

async function listarPacientes(ordemAlfabetica = false) {
	const pacientes = await Paciente.findAll();

	var table = new Table({
		head: ['CPF', 'Nome', 'Dt.Nasc.', 'Idade'],
	});

	if (ordemAlfabetica) {
		pacientes.sort((a, b) => a.nome().localeCompare(b.nome()));
	} else {
		pacientes.sort((a, b) => a.cpf().localeCompare(b.cpf()));
	}

	pacientes.forEach(paciente => {

		table.push(
			[paciente.cpf(), paciente.nome(), paciente.dataNascimento(), Math.floor(DateTime.now().diff(DateTime.fromFormat(paciente.dataNascimento(), 'dd/MM/yyyy'), 'years').years)]
		);

	});
	console.log(table.toString());
}

function listarAgenda(agendamentos, dataInicio = null, dataFim = null) {
	var table = new Table({
		head: ['Data', 'H.Ini', 'HG.Fim', 'Tempo', 'Nome', 'Dt.Nasc.'],
	});

	agendamentos
		.filter(ag => {
			const dataConsulta = DateTime.fromFormat(ag.dataConsulta(), 'dd/MM/yyyy');
			const inicio = dataInicio ? DateTime.fromFormat(dataInicio, 'dd/MM/yyyy') : null;
			const fim = dataFim ? DateTime.fromFormat(dataFim, 'dd/MM/yyyy') : null;
			return (!inicio || dataConsulta >= inicio) && (!fim || dataConsulta <= fim);
		})
		.sort((a, b) => {
			const dataA = DateTime.fromFormat(a.dataConsulta() + a.horaInicial(), 'dd/MM/yyyy HHmm');
			const dataB = DateTime.fromFormat(b.dataConsulta() + b.horaInicial(), 'dd/MM/yyyy HHmm');
			return dataA - dataB;
		})
		.forEach(ag => {
			const inicio = DateTime.fromFormat(ag.horaInicial(), 'HHmm');
			const fim = DateTime.fromFormat(ag.horaFinal(), 'HHmm');
			const diff = fim.diff(inicio, ['hours', 'minutes']).toObject();

			const horas = Math.floor(diff.hours || 0);
			const minutos = diff.minutes || 0;

			const tempo = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

			const horaInicialLuxon = DateTime.fromFormat(ag.horaInicial(), 'HHmm').toFormat('HH:mm');
			const horaFinalLuxon = DateTime.fromFormat(ag.horaFinal(), 'HHmm').toFormat('HH:mm');

			table.push(
				[ag.dataConsulta(), horaInicialLuxon, horaFinalLuxon, tempo, ag.paciente().nome(), ag.paciente().dataNascimento()]
			);
		});

	console.log(table.toString());
}

module.exports = { listarPacientes, listarAgenda };
