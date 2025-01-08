-- Drop and recreate the database
DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

-- Connect to the new database
\c employee_tracker

-- Create the department table
DROP TABLE IF EXISTS department, role, employee CASCADE;
CREATE TABLE department (
  id SERIAL PRIMARY KEY, -- Unique ID for each department
  name VARCHAR(50) NOT NULL -- Department name (cannot be null)
);

-- Create the role table
CREATE TABLE role (
  id SERIAL PRIMARY KEY, -- Unique ID for each role
  title VARCHAR(50) NOT NULL, -- Role title (cannot be null)
  salary DECIMAL(10, 2) NOT NULL, -- Role salary with precision for cents
  department_id INT NOT NULL, -- Foreign key referencing department table
  CONSTRAINT FK_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

-- Create the employee table
CREATE TABLE employee (
  id SERIAL PRIMARY KEY, -- Unique ID for each employee
  first_name VARCHAR(50) NOT NULL, -- Employee's first name
  last_name VARCHAR(50) NOT NULL, -- Employee's last name
  role_id INT NOT NULL, -- Foreign key referencing role table
  manager_id INT, -- Optional self-referencing foreign key for manager
  CONSTRAINT FK_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  CONSTRAINT FK_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL -- Set manager_id to NULL if manager is deleted
);

