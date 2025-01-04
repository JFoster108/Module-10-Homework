const inquirer = require('inquirer');
const { Pool } = require('pg');
const cTable = require('console.table');

const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'employee_db',
  password: 'your_password',
  port: 5432,
});

const mainMenu = async () => {
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add Department',
      'Add Role',
      'Add Employee',
      'Update Employee Role',
      'Exit',
    ],
  });

  switch (action) {
    case 'View All Departments':
      await viewDepartments();
      break;
    case 'View All Roles':
      await viewRoles();
      break;
    case 'View All Employees':
      await viewEmployees();
      break;
    case 'Add Department':
      await addDepartment();
      break;
    case 'Add Role':
      await addRole();
      break;
    case 'Add Employee':
      await addEmployee();
      break;
    case 'Update Employee Role':
      await updateEmployeeRole();
      break;
    case 'Exit':
      console.log('Goodbye!');
      pool.end();
      process.exit();
  }

  mainMenu();
};

const viewDepartments = async () => {
  const { rows } = await pool.query('SELECT * FROM department');
  console.table(rows);
};

const viewRoles = async () => {
  const { rows } = await pool.query(`
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
  `);
  console.table(rows);
};

const viewEmployees = async () => {
  const { rows } = await pool.query(`
    SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id
    JOIN role ON e.role_id = role.id
    JOIN department ON role.department_id = department.id
  `);
  console.table(rows);
};

const addDepartment = async () => {
  const { name } = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter the name of the department:',
  });
  await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
  console.log(`Department "${name}" added.`);
};

const addRole = async () => {
  const departments = await pool.query('SELECT * FROM department');
  const { title, salary, department_id } = await inquirer.prompt([
    { type: 'input', name: 'title', message: 'Enter the role title:' },
    { type: 'input', name: 'salary', message: 'Enter the role salary:' },
    {
      type: 'list',
      name: 'department_id',
      message: 'Choose the department:',
      choices: departments.rows.map((dept) => ({
        name: dept.name,
        value: dept.id,
      })),
    },
  ]);
  await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
  console.log(`Role "${title}" added.`);
};

const addEmployee = async () => {
  const roles = await pool.query('SELECT * FROM role');
  const employees = await pool.query('SELECT * FROM employee');
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    { type: 'input', name: 'first_name', message: "Enter the employee's first name:" },
    { type: 'input', name: 'last_name', message: "Enter the employee's last name:" },
    {
      type: 'list',
      name: 'role_id',
      message: "Choose the employee's role:",
      choices: roles.rows.map((role) => ({ name: role.title, value: role.id })),
    },
    {
      type: 'list',
      name: 'manager_id',
      message: "Choose the employee's manager:",
      choices: [{ name: 'None', value: null }].concat(
        employees.rows.map((emp) => ({
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        }))
      ),
    },
  ]);
  await pool.query(
    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
    [first_name, last_name, role_id, manager_id]
  );
  console.log(`Employee "${first_name} ${last_name}" added.`);
};

const updateEmployeeRole = async () => {
  const employees = await pool.query('SELECT * FROM employee');
  const roles = await pool.query('SELECT * FROM role');
  const { employee_id, role_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Choose the employee to update:',
      choices: employees.rows.map((emp) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
      })),
    },
    {
      type: 'list',
      name: 'role_id',
      message: "Choose the employee's new role:",
      choices: roles.rows.map((role) => ({ name: role.title, value: role.id })),
    },
  ]);
  await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
  console.log('Employee role updated.');
};

mainMenu();
