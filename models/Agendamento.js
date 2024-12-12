const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { validarHorario } = require('../utils/utils');

class Agendamento extends Model {
  valido() {
    return validarHorario(this.dataConsulta, this.horaInicial, this.horaFinal);
  }

  conflito(outro) {
    return (
      this.dataConsulta === outro.dataConsulta &&
      ((this.horaInicial >= outro.horaInicial && this.horaInicial < outro.horaFinal) ||
        (outro.horaInicial >= this.horaInicial && outro.horaInicial < this.horaFinal))
    );
  }

  toString() {
    return `${this.dataConsulta} ${this.horaInicial} - ${this.horaFinal} Paciente: ${this.Paciente.nome} ${this.Paciente.cpf}`;
  }
}

Agendamento.init({
  dataConsulta: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isAfter: new Date().toISOString().split('T')[0]
    }
  },
  horaInicial: {
    type: DataTypes.STRING(4),
    allowNull: false,
    validate: {
      validHora(value) {
        if (!/^\d{4}$/.test(value)) {
          throw new Error('Horário deve estar no formato HHMM');
        }
        const hora = parseInt(value.substring(0, 2), 10);
        const minuto = parseInt(value.substring(2), 10);
        
        if (hora < 0 || hora > 23 || minuto < 0 || minuto > 59) {
          throw new Error('Horário inválido');
        }
        
        if (minuto % 15 !== 0) {
          throw new Error('Horários devem ser múltiplos de 15 minutos');
        }
      }
    }
  },
  horaFinal: {
    type: DataTypes.STRING(4),
    allowNull: false,
    validate: {
      validHora(value) {
        if (!/^\d{4}$/.test(value)) {
          throw new Error('Horário deve estar no formato HHMM');
        }
        const hora = parseInt(value.substring(0, 2), 10);
        const minuto = parseInt(value.substring(2), 10);
        
        if (hora < 0 || hora > 23 || minuto < 0 || minuto > 59) {
          throw new Error('Horário inválido');
        }
        
        if (minuto % 15 !== 0) {
          throw new Error('Horários devem ser múltiplos de 15 minutos');
        }
      }
    }
  },
  pacienteCpf: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Paciente',
      key: 'cpf'
    }
  }
}, {
  sequelize,
  modelName: 'Agendamento',
  tableName: 'agendamentos',
  timestamps: true
});

Agendamento.associate = (models) => {
  Agendamento.belongsTo(models.Paciente, {
    foreignKey: 'pacienteCpf',
    targetKey: 'cpf'
  });
};

module.exports = { Agendamento };