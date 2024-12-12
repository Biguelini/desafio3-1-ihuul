const { Op } = require('sequelize');
const { DateTime } = require('luxon');
const { dataFormatoValido, horaValida } = require('../utils/utils');
const { listarAgenda } = require('../views/listagem');

class AgendaController {
  constructor(db) {
    this.Agendamento = db.Agendamento;
    this.Paciente = db.Paciente;
  }

  async agendarConsulta(cpf, dataConsulta, horaInicial, horaFinal) {
    try {
      const paciente = await this.Paciente.findOne({ where: { cpf } });
      if (!paciente) {
        throw new Error("Paciente não encontrado.");
      }

      if (!dataFormatoValido(dataConsulta)) {
        throw new Error("Data inválida.");
      }

      if (!horaValida(horaInicial) || !horaValida(horaFinal)) {
        throw new Error("Horários inválidos. Horários devem ser múltiplos de 15 minutos.");
      }

      const agendamento = await this.Agendamento.create({
        dataConsulta,
        horaInicial,
        horaFinal,
        pacienteId: paciente.id
      });

      const conflitos = await this.Agendamento.findAll({
        where: {
          dataConsulta,
          [Op.or]: [
            {
              horaInicial: {
                [Op.lt]: horaFinal,
                [Op.gte]: horaInicial
              }
            },
            {
              horaFinal: {
                [Op.gt]: horaInicial,
                [Op.lte]: horaFinal
              }
            }
          ]
        }
      });

      if (conflitos.length > 0) {
        await agendamento.destroy();
        throw new Error("Conflito com outro agendamento.");
      }

      return agendamento;
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      throw error;
    }
  }

  async excluirAgendamento(cpf, dataConsulta, horaInicial) {
    try {
      const paciente = await this.Paciente.findOne({ where: { cpf } });
      if (!paciente) {
        throw new Error("Paciente não encontrado.");
      }

      if (!dataFormatoValido(dataConsulta)) {
        throw new Error("Data inválida.");
      }

      if (!horaValida(horaInicial)) {
        throw new Error("Horário inválido. Horários devem ser múltiplos de 15 minutos.");
      }

      const agendamento = await this.Agendamento.findOne({
        where: {
          pacienteId: paciente.id,
          dataConsulta,
          horaInicial
        }
      });

      if (!agendamento) {
        throw new Error("Agendamento não encontrado");
      }

      const agora = DateTime.now();
      const inicioAgendamento = DateTime.fromFormat(`${dataConsulta} ${horaInicial}`, "dd/MM/yyyy HHmm");

      if (inicioAgendamento <= agora) {
        throw new Error("Você só pode cancelar agendamentos futuros.");
      }

      await agendamento.destroy();

      return true;
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      throw error;
    }
  }

  async listarAgenda(filtro = 'T', dataInicial = null, dataFinal = null) {
    try {
      let whereCondition = {};

      if (filtro === 'P' && dataInicial && dataFinal) {
        whereCondition.dataConsulta = {
          [Op.between]: [dataInicial, dataFinal]
        };
      }

      const agendamentos = await this.Agendamento.findAll({
        where: whereCondition,
        include: [{ model: this.Paciente }],
        order: [['dataConsulta', 'ASC'], ['horaInicial', 'ASC']]
      });

      return agendamentos;
    } catch (error) {
      console.error("Erro ao listar agenda:", error);
      throw error;
    }
  }

  async menuAgenda(opcao, params = {}) {
    switch (opcao) {
      case '1':
        return this.agendarConsulta(
          params.cpf, 
          params.dataConsulta, 
          params.horaInicial, 
          params.horaFinal
        );
      case '2':
        return this.excluirAgendamento(
          params.cpf, 
          params.dataConsulta, 
          params.horaInicial
        );
      case '3':
		return listarAgenda(this.listarAgenda(
			params.filtro, 
			params.dataInicial, 
			params.dataFinal
		  ))
        
      default:
        throw new Error("Opção inválida");
    }
  }
}

module.exports = AgendaController;