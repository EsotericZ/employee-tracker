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
                'View all Employees by Manager',
                'View all Employees by Department',
                'View total utilized budget of a Department',
                'Add a Department',
                'Add a Role',
                'And an Employee',
                'Update an Employee Role',
                'Update an Employee Manager'
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
            } else if(answers.options === "View all Employees by Manager") {
                viewEmplByMang();
            } else if(answers.options === "View all Employees by Department") {
                viewEmplByDept();
            } else if(answers.options === "View total utilized budget of a Department") {
                departmentBudget();
            } else if(answers.options === "Add a Department") {
                addDepartment();
            } else if(answers.options === "Add a Role") {
                addRole();
            } else if(answers.options === "And an Employee") {
                addEmployee();
            } else if(answers.options === "Update an Employee Role") {
                updateEmpRole();
            } else if(answers.options === "Update an Employee Manager") {
                updateEmpMang();
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
    db.query("SELECT E.id, E.first_name, E.last_name, R.title, D.name department, R.salary, CONCAT(M.first_name, ' ', M.last_name) manager FROM employee E INNER JOIN role R ON E.role_id = R.id INNER JOIN department D ON R.department_id = D.id LEFT JOIN employee M ON E.manager_id = M.id;", (err, result) => {
        if (err) { console.log(err) }
        console.table(result)
        allOptions();
    });
}

MangOpt = [];
MangOpts = [];
const viewEmplByMang = () => {
    db.query("SELECT * FROM employee;", (err, result) => {
        if (err) { console.log(err) }
        result.forEach(n => { 
            MangOpt.push(n.first_name + " " + n.last_name);
            MangOpts.push([n.id, n.first_name + " " + n.last_name]);
        });
    });
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'If selected employee is not a manager, will return to prompt. Press [Enter] to continue.',
                name: 'dummyVar',
            },
            {
                type: 'list',
                message: 'Which manager would you like to see?',
                choices: MangOpt,
                name: 'managerName',
            },
        ])
        .then(answers => {
            const manName = answers.managerName;
            let managerNo;
            MangOpts.forEach(dept => {
                if (manName === dept[1]) {
                    managerNo = dept[0];
                }
            })
            db.query("SELECT E.id, E.first_name, E.last_name, R.title, D.name department, R.salary, CONCAT(M.first_name, ' ', M.last_name) manager FROM employee E INNER JOIN role R ON E.role_id = R.id INNER JOIN department D ON R.department_id = D.id LEFT JOIN employee M ON E.manager_id = M.id WHERE E.manager_id = ?;", [managerNo], (err, result) => {
                if (err) { console.log(err) }
                console.table(result)
                allOptions();
            });
        });
};

DeptOpt = [];
DeptOpts = [];
const viewEmplByDept = () => {
    db.query("SELECT * FROM department;", (err, result) => {
        if (err) { console.log(err) }
        result.forEach(n => { 
            DeptOpt.push(n.name);
            DeptOpts.push([n.id, n.name]);
        });
    });
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'If no employees in department, will return to prompt. Press [Enter] to continue.',
                name: 'dummyVar',
            },
            {
                type: 'list',
                message: 'Which department would you like to see?',
                choices: DeptOpt,
                name: 'departmentName',
            },
        ])
        .then(answers => {
            const deptName = answers.departmentName;
            let deptNo;
            DeptOpts.forEach(dept => {
                if (deptName === dept[1]) {
                    deptNo = dept[0];
                }
            })
            db.query("SELECT E.id, E.first_name, E.last_name, R.title, D.name department, R.salary, CONCAT(M.first_name, ' ', M.last_name) manager FROM employee E INNER JOIN role R ON E.role_id = R.id INNER JOIN department D ON R.department_id = D.id LEFT JOIN employee M ON E.manager_id = M.id WHERE D.id = ?;", [deptNo], (err, result) => {
                if (err) { console.log(err) }
                console.table(result)
                allOptions();
            });
        });
};

DepBudOpt = [];
DepBudOpts = [];
const departmentBudget = () => {
    db.query("SELECT * FROM department;", (err, result) => {
        if (err) { console.log(err) }
        result.forEach(n => { 
            DepBudOpt.push(n.name);
            DepBudOpts.push([n.id, n.name]);
        });
    });
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'If no employees in department, will return to prompt. Press [Enter] to continue.',
                name: 'dummyVar',
            },
            {
                type: 'list',
                message: 'Which department would you like to see?',
                choices: DepBudOpt,
                name: 'deptName',
            },
        ])
        .then(answers => {
            const depName = answers.deptName;
            let depBudNo;
            DepBudOpts.forEach(dept => {
                if (depName === dept[1]) {
                    depBudNo = dept[0];
                }
            })
            db.query("SELECT D.name department, SUM(R.salary) FROM employee E INNER JOIN role R ON E.role_id = R.id INNER JOIN department D ON R.department_id = D.id WHERE D.id = ?;", [depBudNo], (err, result) => {
                if (err) { console.log(err) }
                console.table(result)
                allOptions();
            });
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
            const newDept = answers.newDepartment;
            db.query("INSERT INTO department (name) VALUES (?);", [newDept], (err, results) => {
                if (err) { console.log(err) }
                console.log(" ")
                allOptions();
            });
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
            db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);", [newName, newSalary, newDeptNo], (err, results) => {
                if (err) { console.log(err) }
                console.log("Role Successfully Added")
                allOptions();
            });
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
                console.log("Employee Successfully Added")
                allOptions();
            });
        });
};

let showEmp = [];
let empSelector = [];
let showRole = [];
let roleSelector = [];
const updateEmpRole = () => {
    db.query("SELECT * FROM employee;", (err, result) => {
        if (err) { console.log(err) }
        result.forEach(n => { 
            showEmp.push(n.first_name + " " + n.last_name);
            empSelector.push([n.id, n.first_name + " " + n.last_name]);
        });
    });
    db.query("SELECT * FROM role;", (err, result) => {
        if (err) { console.log(err) }
        result.forEach(n => { 
            showRole.push(n.title);
            roleSelector.push([n.id, n.title]);
        });
    });
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Are you sure you want to change an employee role? Press [Enter] for yes, [ctrl+c] to cancel',
                name: 'dummyVar',
            },
            {
                type: 'list',
                message: 'Which employee would you like to update?',
                choices: showEmp,
                name: 'updateEmployee',
            },
            {
                type: 'list',
                message: 'What role would you like them to have?',
                choices: showRole,
                name: 'updateRole',
            },
        ])
        .then(answers => {
            const upEmp = answers.updateEmployee;
            const upRole = answers.updateRole;
            let upRoleNo;
            let upEmpNo;
            empSelector.forEach(emp => {
                if (upEmp === emp[1]) {
                    upEmpNo = emp[0];
                }
            })
            roleSelector.forEach(rol => {
                if (upRole === rol[1]) {
                    upRoleNo = rol[0];
                }
            })
            db.query("UPDATE employee SET role_id = ? WHERE id = ?;", [upRoleNo, upEmpNo], (err, results) => {
                if (err) { console.log(err) }
                console.log("Role Successfully Updated")
                allOptions();
            });
        });
};

let showEmpl = [];
let emplSelector = [];
const updateEmpMang = () => {
    db.query("SELECT * FROM employee;", (err, result) => {
        if (err) { console.log(err) }
        result.forEach(n => { 
            showEmpl.push(n.first_name + " " + n.last_name);
            emplSelector.push([n.id, n.first_name + " " + n.last_name]);
        });
    });
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Are you sure you want to update an employees manager? Press [Enter] for yes, [ctrl+c] to cancel',
                name: 'dummyVar',
            },
            {
                type: 'list',
                message: 'Which employee would you like to update?',
                choices: showEmpl,
                name: 'chooseEmployee',
            },
            {
                type: 'list',
                message: 'What manager would you like them to have?',
                choices: showEmpl,
                name: 'updateMang',
            },
        ])
        .then(answers => {
            const empChoice = answers.chooseEmployee;
            const upMang = answers.updateMang;
            let employeeNo;
            let upMangNo;
            emplSelector.forEach(emp => {
                if (empChoice === emp[1]) {
                    employeeNo = emp[0];
                }
            })
            emplSelector.forEach(rol => {
                if (upMang === rol[1]) {
                    upMangNo = rol[0];
                }
            })
            db.query("UPDATE employee SET manager_id = ? WHERE id = ?;", [upMangNo, employeeNo], (err, results) => {
                if (err) { console.log(err) }
                console.log("Manager Successfully Updated")
                allOptions();
            });
        });
};

allOptions();