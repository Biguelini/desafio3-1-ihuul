
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

const initPacienteModel = require('../models/Paciente');
const initAgendamentoModel = require('../models/Agendamento');

const Paciente = initPacienteModel(sequelize);
const Agendamento = initAgendamentoModel(sequelize, Paciente);

if (Paciente.associations) {
  Object.keys(Paciente.associations).forEach(assocName => {
    Paciente.associations[assocName].sync();
  });
}

if (Agendamento.associations) {
  Object.keys(Agendamento.associations).forEach(assocName => {
    Agendamento.associations[assocName].sync();
  });
}

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  Paciente,
  Agendamento,
  syncDatabase
};
