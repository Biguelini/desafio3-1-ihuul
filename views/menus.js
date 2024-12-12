const prompt = require('../utils/prompt');

function exibirMenuPrincipal() {
    console.log("\nMenu Principal:");
    console.log("1 - Cadastro de pacientes");
    console.log("2 - Agenda");
    console.log("3 - Fim");

    const opcao = prompt("Escolha uma opção: ");
    return opcao;
}

function exibirMenuCadastroPaciente() {
    console.log("\nMenu do Cadastro de Pacientes:");
    console.log("1 - Cadastrar novo paciente");
    console.log("2 - Excluir paciente");
    console.log("3 - Listar pacientes (ordenado por CPF)");
    console.log("4 - Listar pacientes (ordenado por nome)");
    console.log("5 - Voltar para o menu principal");

    const opcao = prompt("Escolha uma opção: ");
    return opcao;
}

function exibirMenuAgenda() {
    console.log("\nAgenda:");
    console.log("1 - Agendar consulta");
    console.log("2 - Cancelar agendamento");
    console.log("3 - Listar agenda");
    console.log("4 - Voltar para o menu principal");

    const opcao = prompt("Escolha uma opção: ");
    return opcao;
}

module.exports = { exibirMenuPrincipal, exibirMenuCadastroPaciente, exibirMenuAgenda };
