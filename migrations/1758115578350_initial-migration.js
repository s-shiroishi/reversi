exports.up = (pgm) => {
  // Enable UUID extension
  pgm.createExtension('uuid-ossp', { ifNotExists: true });

  // Stones table
  pgm.createTable('stones', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    color: {
      type: 'varchar(10)',
      notNull: true,
      check: "color IN ('black', 'white')"
    }
  });

  // Games table
  pgm.createTable('games', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      check: "status IN ('playing', 'finished')",
      default: 'playing'
    },
    turn:{
      type: 'uuid',
      notNull: true,
      references: 'stones',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // move table
  pgm.createTable('move', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    game_id: {
      type: 'uuid',
      notNull: true,
      references: 'games',
      onDelete: 'CASCADE'
    },
    stone_id: {
      type: 'uuid',
      notNull: true,
      references: 'stones',
      onDelete: 'CASCADE'
    },
    row: {
      type: 'integer',
      notNull: true,
      check: 'row >= 1 AND row <= 8'
    },
    col: {
      type: 'integer',
      notNull: true,
      check: 'col >= 1 AND col <= 8'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Results table
  pgm.createTable('results', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    game_id: {
      type: 'uuid',
      notNull: true,
      references: 'games',
      onDelete: 'CASCADE',
      unique: true
    },
    winner_id: {
      type: 'uuid',
      notNull: true,
      references: 'stones',
    },
    black_score: {
      type: 'integer',
      notNull: true,
      default: 0
    },
    white_score: {
      type: 'integer',
      notNull: true,
      default: 0
    },
    finished_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Create indexes for foreign keys
  pgm.createIndex('games', 'user_id');
  pgm.createIndex('move', 'game_id');
  pgm.createIndex('move', 'stone_id');
  pgm.createIndex('results', 'game_id');
};

exports.down = (pgm) => {
  pgm.dropTable('results');
  pgm.dropTable('move');
  pgm.dropTable('games');
  pgm.dropTable('stones');
  pgm.dropTable('users');
  pgm.dropExtension('uuid-ossp');
};