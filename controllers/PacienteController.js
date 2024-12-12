const { Op } = require('sequelize');
const prompt = require('../utils/prompt');
const { exibirMenuCadastroPaciente } = require('../views/menus');
const { dataFormatoValido, nomeValido, validarCPF, calcularIdade } = require('../utils/utils');
const { listarPacientes } = require('../views/listagem');
const { DateTime } = require('luxon');

const { Paciente } = require('../models/Paciente');
const { Agendamento } = require('../models/Agendamento');

async function adicionarPaciente() {
    let cpf;
    let nome;
    let dataNascimento;

    while (true) {
        cpf = prompt("CPF: ").replace(/\D/g, "");

        if (!validarCPF(cpf)) {
            console.log("Erro: CPF inválido. Digite novamente.");
            continue;
        }

        const pacienteExistente = await Paciente.findOne({ where: { cpf } });
        if (pacienteExistente) {
            console.log("Erro: CPF duplicado. Digite novamente.");
            continue;
        }

        break;
    }

    while (true) {
        nome = prompt("Nome: ");

        if (!nomeValido(nome)) {
            console.log("Nome inválido. Digite novamente.");
            continue;
        }

        break;
    }

    while (true) {
        dataNascimento = prompt("Data de nascimento (DD/MM/AAAA): ");

        if (dataFormatoValido(dataNascimento) == false) {
            console.log("Erro: data de nascimento inválida. Digite novamente.");
            continue;
        }

        if (calcularIdade(dataNascimento) < 13) {
            console.log("Erro: o dentista só atende pacientes com 13 anos ou mais. Verifique a data de nascimento.");
            continue;
        }

        break;
    }

    try {
        const paciente = await Paciente.create({ cpf, nome, dataNascimento });
        console.log("Paciente cadastrado com sucesso!");
        return paciente;
    } catch (error) {
        console.error("Erro ao cadastrar paciente:", error);
        return null;
    }
}

async function excluirPaciente() {
    const cpf = prompt("CPF do paciente a ser excluído: ");

    try {
        const paciente = await Paciente.findOne({ where: { cpf } });

        if (!paciente) {
            console.log("Erro: paciente não encontrado.");
            return;
        }

        const consultasFuturas = await Agendamento.findOne({
            where: {
                pacienteCpf: cpf,
                dataConsulta: {
                    [Op.gt]: DateTime.now().toFormat('dd/MM/yyyy')
                }
            }
        });

        if (consultasFuturas) {
            console.log("Erro: não é possível excluir o paciente. Existem consultas futuras agendadas.");
            return;
        }

        await Agendamento.destroy({ where: { pacienteCpf: cpf } });

        await paciente.destroy();

        console.log("Paciente excluído com sucesso.");
    } catch (error) {
        console.error("Erro ao excluir paciente:", error);
    }
}

function menuCadastroPaciente() {
    let opcao;
    do {
        opcao = exibirMenuCadastroPaciente();
        switch (opcao) {
            case '1':
                adicionarPaciente();
                break;
            case '2':
                excluirPaciente();
                break;
            case '3':
                listarPacientes();
                break;
            case '4':
                listarPacientes(true);
                break;
        }
    } while (opcao !== '5');
}

module.exports = { 
    menuCadastroPaciente, 
    adicionarPaciente, 
    excluirPaciente
};