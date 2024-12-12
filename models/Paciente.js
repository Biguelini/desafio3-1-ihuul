const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Paciente extends Model {
  toString() {
    return `CPF: ${this.cpf}, Nome: ${this.nome}, Data de Nasc.: ${this.dataNascimento}`;
  }
}

Paciente.init({
  cpf: {
    type: DataTypes.STRING(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [11, 11]
    }
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  dataNascimento: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  sequelize,
  modelName: 'Paciente',
  tableName: 'pacientes',
  timestamps: false
});

module.exports = { Paciente };