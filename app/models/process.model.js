module.exports = (sequelize, Sequelize) => {
    const Processes = sequelize.define("Processes", {
      processId: {
        type: Sequelize.INTEGER
      },
      creatorId: {
        type: Sequelize.STRING
      },
      participantId: {
        type: Sequelize.STRING
      },
      canViewComment: {
        type: Sequelize.BOOLEAN
      },
      signedOff: {
        type: Sequelize.BOOLEAN
      },
      comment: {
        type: Sequelize.TEXT
      },
      picture: {
        type: Sequelize.TEXT
      }
    });
  
    return Processes;
  };