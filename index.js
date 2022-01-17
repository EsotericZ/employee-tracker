const inquirer = require("inquirer");

inquirer.prompt([
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



    {
        type: 'input',
        message: 'What is the name of the new department?',
        name: 'newDepartment',
    },



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
]);