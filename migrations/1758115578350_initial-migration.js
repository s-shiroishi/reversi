exports.up = (pgm) => {
  // Enable UUID extension
  pgm.createExtension('uuid-ossp', { ifNotExists: true });

  // Users table
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()')
    },
    auth_id: {
      type: 'uuid',
      notNull: true,
      unique: true
    },
    name: { type: 'varchar(255)', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

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
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE'
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      check: "status IN ('playing', 'finished')",
      default: 'playing'
    },
    user_color: {
      type: 'varchar(10)',
      notNull: true,
      check: "user_color IN ('black', 'white')"
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
    winner: {
      type: 'varchar(10)',
      notNull: true,
      check: "winner IN ('user', 'ai', 'draw')"
    },
    user_score: {
      type: 'integer',
      notNull: true
    },
    ai_score: {
      type: 'integer',
      notNull: true
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