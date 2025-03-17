import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    // User Type table
    await queryInterface.createTable('user_type', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING(15),
        unique: true,
      },
    });

    // Specialization table
    await queryInterface.createTable('specialization', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    });

    // City table
    await queryInterface.createTable('city', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    });

    // User table
    await queryInterface.createTable('user', {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        unique: true,
      },
      userType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_type',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION',
      },
      firstName: {
        type: DataTypes.STRING(55),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(55),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.CHAR(11),
        allowNull: false,
        unique: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING(350),
        allowNull: true,
      },
      gender: {
        type: DataTypes.TINYINT(),
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    // Clinic table
    await queryInterface.createTable('clinic', {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        unique: true,
      },
      doctorId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(455),
        allowNull: false,
      },
      clinicName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      phone: {
        type: DataTypes.CHAR(11),
        allowNull: false,
        unique: true,
      },
    });

    // Appointment table with foreign keys
    await queryInterface.createTable('appointment', {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
      },
      patientId: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      clinicId: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      nurseId: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      bookedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    })
    .then(() => queryInterface.addConstraint('appointment', {
      fields: ['patientId'],
      type: 'foreign key',
      name: 'appointment_patientId_fkey',
      references: {
        table: 'user',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }))
    .then(() => queryInterface.addConstraint('appointment', {
      fields: ['clinicId'],
      type: 'foreign key',
      name: 'appointment_clinicId_fkey',
      references: {
        table: 'clinic',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }))
    .then(() => queryInterface.addConstraint('appointment', {
      fields: ['nurseId'],
      type: 'foreign key',
      name: 'appointment_nurseId_fkey',
      references: {
        table: 'user',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }));

    // Blood table
    await queryInterface.createTable('blood', {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
      },
      patientId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      isRequest: {
        type: DataTypes.TINYINT(),
        allowNull: false,
      },
      bloodType: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      describtion: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
    });

    // Clinic Schedule table
    await queryInterface.createTable('clinic_schedule', {
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique:false
      },
      clinicId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey:true,
      },
      from: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      to: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    })
    .then(() => queryInterface.addConstraint('clinic_schedule', {
      fields: ['clinicId'],
      type: 'foreign key',
      name: 'clinic_schedule_clinicId_fkey',
      references: {
        table: 'clinic',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }));
      // Diagnosis table
    await queryInterface.createTable('diagnosis', {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
      },
      patientId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      doctorId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      clinicId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'clinic',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(400),
        allowNull: false,
      },
    });

    // Doctor/Nurse table
    await queryInterface.createTable('doctor_nurse', {
      userId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        unique: true,
        primaryKey: true,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      specialization: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fees: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(400),
        allowNull: false,
      },
      appointmentTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
    });

    // Medicine table
    await queryInterface.createTable('medicine', {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
      },
      diagnosisId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'diagnosis',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      dosage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    });

    // Rating table
    await queryInterface.createTable('rating', {
      ratedId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      patientId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
    });

    // Receptionist table
    await queryInterface.createTable('receptionist', {
      receptionistId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        unique: true,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      doctorId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      clinicId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'clinic',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    // Session table
    await queryInterface.createTable('session', {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_type',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      valid: {
        type: DataTypes.TINYINT(),
        allowNull: true,
        defaultValue: 1,
      },
      userAgent: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastAccess: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('medicine');  
    await queryInterface.dropTable('rating');     
    await queryInterface.dropTable('appointment');
    await queryInterface.dropTable('diagnosis');  
    await queryInterface.dropTable('clinic_schedule');
    await queryInterface.dropTable('blood');       
    await queryInterface.dropTable('session');     
    await queryInterface.dropTable('receptionist');
    await queryInterface.dropTable('doctor_nurse');
    await queryInterface.dropTable('clinic');      
    await queryInterface.dropTable('user');        
    await queryInterface.dropTable('specialization');
    await queryInterface.dropTable('city');
    await queryInterface.dropTable('user_type');

  }
};