const { exibirMenuPrincipal } = require('./views/menus.js');
const { syncDatabase } = require('./config/database');

async function main() {
    try {
        await syncDatabase();

        let opcao;
        do {
            opcao = exibirMenuPrincipal();
            switch (opcao) {
                case '1':
                    require('./controllers/PacienteController.js').menuCadastroPaciente();
                    break;
                case '2':
                    require('./controllers/AgendaController.js').menuAgenda();
                    break;
                case '3':
                    console.log("Saindo...");
                    break;
                default:
                    console.log("Erro: opção inválida.");
            }
        } while (opcao !== '3');
    } catch (error) {
        console.error("Erro ao inicializar o aplicativo:", error);
    }
}

(async () => {
    await main();
})();