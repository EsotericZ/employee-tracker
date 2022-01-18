const inquirer = require("inquirer");
// const newD = require("./connection/index.js")
const mysql = require("mysql2");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "password",
        database: "company"
    },
    console.log(`Connected to the database`)
);

const allOptions = () => {
    inquirer
        .prompt([
            {
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all Departments',
                'View all Roles',
                'View all Employees',
                'Add a Department',
                'Add a Role',
                'And an Employee',
                'Update an Employee Role',
            ],
            name: 'options',  
        },
        ])
        .then(answers => {
            if(answers.options === "Add a Department") {
                addDepartment();
            } else if(answers.options === "Add a Role") {
                addRole();
            } else if(answers.options === "Add an Employee") {
                addEmployee();
            }
        });
};

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the new department?',
                name: 'newDepartment',
            },
        ])
        .then(answers => {
            console.log(answers.newDepartment);

            allOptions();
        });
};

const addRole = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the new role?',
                name: 'newRoleName',
            },
            {
                type: 'input',
                message: 'What is the salary of the new role?',
                name: 'newRoleSalary',
            },
            {
                type: 'input',
                message: 'What is the department of the new role?',
                name: 'newRoleDepartment',
            },
        ])
        .then(answers => {
            console.log(answers.newRoleName, answers.newRoleSalary, answers.newRoleDepartment)
            allOptions();
        });
};

const addEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the first name of the new employee?',
                name: 'newEmpFirstName',
            },
            {
                type: 'input',
                message: 'What is the last name of the new employee?',
                name: 'newEmpLastName',
            },
            {
                type: 'input',
                message: 'What is the role of the new employee?',
                name: 'newEmpRole',
            },
            {
                type: 'input',
                message: 'Who is the manager of the new employee?',
                name: 'newEmpManager',
            },
        ])
        .then(answers => {
            console.log(answers.newEmpFirstName, answers.newEmpLastName, answers.newEmpRole, answers.newEmpManager)
            allOptions();
        });
};

allOptions();