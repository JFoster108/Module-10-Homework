INSERT INTO department (name) VALUES ('Sales'), ('Engineering'), ('HR');
INSERT INTO role (title, salary, department_id) VALUES 
  ('Salesperson', 50000, 1), 
  ('Engineer', 75000, 2),
  ('Fashion Designer', 60000, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('Cindyroara', 'Trisha', 1, NULL),
  ('Tina', 'McShine', 2, 1),
  ('Alicia', 'Vega', 3, NULL);
