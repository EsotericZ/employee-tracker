const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

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
                'Update an Employee Role'
            ],
            name: 'options',  
        },
        ])
        .then(answers => {
            if (answers.options === "View all Departments") {
                viewDepartments();
            } else if(answers.options === "View all Roles") {
                viewRoles();
            } else if(answers.options === "View all Employees") {
                viewEmployees();
            } else if(answers.options === "Add a Department") {
                addDepartment();
            } else if(answers.options === "Add a Role") {
                addRole();
            } else if(answers.options === "And an Employee") {
                addEmployee();
            } else if(answers.options === "Update an Employee Role") {
                updateEmpRole();
            } else {
                return
            }
        });
};

const viewDepartments = () => {
    db.query("SELECT * FROM department;", (err, result) => {
        if (err) { console.log(err) }
        console.table(result)
        allOptions();
    });
}

const viewRoles = () => {
    db.query("SELECT R.id, R.title, R.salary, D.name department FROM role R INNER JOIN department D ON R.department_id = D.id;", (err, result) => {
        if (err) { console.log(err) }
        console.table(result)
        allOptions();
    });
}

const viewEmployees = () => {
    // db.query("SELECT E.id, E.first_name, E.last_name, R.title, D.name department, R.salary, M.manager_id FROM employee E JOIN role R ON E.role_id = R.id JOIN department D ON R.department_id = D.id JOIN employee M ON E.manger_id = M.id;", (err, result) => {
    db.query("SELECT E.id, E.first_name, E.last_name, R.title, D.name department, R.salary, E.manager_id FROM employee E INNER JOIN role R ON E.role_id = R.id INNER JOIN department D ON R.department_id = D.id;", (err, result) => {
        if (err) { console.log(err) }
        console.table(result)
        allOptions();
    });
}

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
            const newDept = answers.newDepartment;
            db.query("INSERT INTO department (name) VALUES (?);", [newDept], (err, results) => {
                if (err) { console.log(err) }
                console.log(" ")
            });
            allOptions();
        });
};

let showopt = [];
let doptions = [];
const addRole = () => {
    db.query("SELECT * FROM department;", (err, result) => {
        if (err) { console.log(err) }
        result.forEach(n => { 
            showopt.push(n.name);
            doptions.push([n.id, n.name]);
        });
    });
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
                type: 'list',
                message: 'Select the department of the new role',
                choices: showopt,
                name: 'newRoleDepartment',
            },
        ])
        .then(answers => {
            const newName = answers.newRoleName;
            const newSalary = answers.newRoleSalary;
            const newDept = answers.newRoleDepartment;
            let newDeptNo;
            doptions.forEach(dept => {
                if (newDept === dept[1]) {
                    newDeptNo = dept[0];
                }
            })
            console.log(newName, newSalary, newDeptNo) 
            db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);", [newName, newSalary, newDeptNo], (err, results) => {
                if (err) { console.log(err) }
                console.log(" ")
            });
            allOptions();
        });
};

let showEopt = [];
let eoptions = [];
let showEMopt = [];
let emoptions = [];
const addEmployee = () => {
    db.query("SELECT * FROM role;", (err, result) => {
        if (err) { console.log(err) }
        result.forEach(n => { 
            showEopt.push(n.title);
            eoptions.push([n.id, n.title]);
        });
    });
    db.query("SELECT * FROM employee;", (err, result) => {
        if (err) { console.log(err) }
        result.forEach(n => { 
            showEMopt.push(n.first_name + " " + n.last_name);
            emoptions.push([n.id, n.first_name + " " + n.last_name]);
        });
    });
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
                type: 'list',
                message: 'What is the role of the new employee?',
                choices: showEopt,
                name: 'newEmpRole',
            },
            {
                type: 'list',
                message: 'Who is the manager of the new employee?',
                choices: showEMopt,
                name: 'newEmpManager',
            },
        ])
        .then(answers => {
            const newFirst = answers.newEmpFirstName;
            const newLast = answers.newEmpLastName;
            const newEmpRole = answers.newEmpRole;
            const newManag = answers.newEmpManager;
            let newRoleNo;
            let newMangNo;
            eoptions.forEach(rol => {
                if (newEmpRole === rol[1]) {
                    newRoleNo = rol[0];
                }
            })
            emoptions.forEach(man => {
                if (newManag === man[1]) {
                    newMangNo = man[0];
                }
            })
            db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);", [newFirst, newLast, newRoleNo, newMangNo], (err, results) => {
                if (err) { console.log(err) }
                console.log(" ")
            });
            allOptions();
        });
};

allOptions();