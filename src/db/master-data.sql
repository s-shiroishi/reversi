-- Insert stone types into stones table
INSERT INTO stones (id, color) VALUES
  (uuid_generate_v4(), 'black'),
  (uuid_generate_v4(), 'white');