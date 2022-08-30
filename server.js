// const npm packages;
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Q3wkyt2p!?',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);
// main function using the inquirer npm package to get employee tracker choices
function main() {
    inquirer.prompt([{
        name: 'mainMenu',
        type: 'list',
        message: "Please select an option: ",
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
    }])
        .then(response => {
            switch (response.mainMenu) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    EmployeeUpdate();
                    break;
                case 'Exit':
                    db.end();
                    break;
            }
        });

};
// function selecting the table from departments and viewing all of them
function viewDepartments() {
    db.query('SELECT * FROM department', (error, result) => {
        if (error) throw error;

        console.log('\nDepartments');
        console.table(result);

        main();
    });
};
// function selecting the table from role and viewing all of them
function viewRoles() {
    db.query('SELECT * FROM role', (error, result) => {
        if (error) throw error;

        console.log('\nRoles');
        console.table(result);

        main();
    });
};
// function selecting the table from employee and viewing all of them
function viewEmployees() {
    db.query('SELECT * FROM employee', (error, result) => {
        if (error) throw error;

        console.log('\nEmployees');
        console.table(result);

        main();
    });
};
// function adding a department to the table departments
function addDepartment() {
    inquirer.prompt([{
        name: 'name',
        type: 'input',
        message: 'Enter the department name: '
    }])
        .then(response => {
            db.query('INSERT INTO department(name) VALUES (?)', [response.name], (error, result) => {
                if (error) throw error;
            })

            viewDepartments();
        });
};
//function to add a role to the role table amd its corresponding data
function addRole() {
    inquirer.prompt([{
        name: 'name',
        type: 'input',
        message: 'Enter the role name: '
    },
    {
        name: 'salary',
        type: 'number',
        message: 'Enter the salary: ',
        validate: salary => {
            if (salary) {
                return true;
            } else {
                console.log('Please enter a number!');
                return false;
            }
        }
    },
    {
        name: 'department',
        type: 'list',
        message: 'Select the department:',
        choices: getDepartments()
    }
    ])
        .then(response => {
            var responseID = 0;

            db.query('SELECT id FROM department WHERE name = ?', [response.department], (error, result) => {

                if (error) throw error;
                result.forEach(id => {
                    responseID = id.id;
                })

                db.query('INSERT INTO role SET ?', {
                    title: response.name,
                    salary: response.salary,
                    department_id: responseID
                }, (error, result) => {
                    if (error) throw error;
                })

                viewRoles();
            });
        });
};
// function that adds an employee to the employee table and its corresponding data
function addEmployee() {
    inquirer.prompt([{
        name: 'firstName',
        type: 'input',
        message: 'Enter the employee first name: '
    },
    {
        name: 'lastName',
        type: 'input',
        message: 'Enter the employee last name: '
    },
    {
        name: 'role',
        type: 'list',
        message: 'Select the role:',
        choices: getRoles()
    },
    {
        name: 'manager',
        type: 'list',
        message: 'Select the manager:',
        choices: getEmployees()
    }
    ])
        .then(response => {
            var roleID = 0;
            var managerID = 0;

            db.query('SELECT id FROM role WHERE title = ?', [response.role], (error, result) => {
                if (error) throw error;

                result.forEach(id => {
                    roleID = id.id;
                })

                var managerFirstName = "";

                for (var i = 0; i < response.manager.length; i++) {
                    if (response.manager.charAt(i) === " ") {
                        break;
                    } else {
                        managerFirstName += response.manager.charAt(i);
                    }
                }

                db.query('SELECT id FROM employee WHERE first_name = ?', [managerFirstName], (error, nextResult) => {
                    if (error) throw error;

                    nextResult.forEach(id => {
                        managerID = id.id;
                    })

                    db.query('INSERT INTO employee SET ?', {
                        first_name: response.firstName,
                        last_name: response.lastName,
                        role_id: roleID,
                        manager_id: managerID
                    }, (error, result) => {
                        if (error) throw error;
                    })

                    viewEmployees();
                });
            });
        });
};
//function that updates the employee info
function EmployeeUpdate() {
    inquirer.prompt([{
        name: 'employee',
        type: 'number',
        message: 'Enter the employee ID of the employee you wish to update:'
    },
    {
        name: 'role',
        type: 'number',
        message: 'Enter the role ID you wish to update the employee to:'
    }
    ])
        .then(response => {
            db.query('UPDATE employee SET role_id = ? WHERE id = ? ', [response.role, response.employee], (error, result) => {
                if (error) throw error;

                viewEmployees();
            });
        });
};

function getDepartments() {
    let departments = [];
    db.query('SELECT name FROM department', (error, response) => {
        if (error) throw error;

        response.forEach(department => {
            departments.push(department.name);
        })
    })

    return departments;
};

function getRoles() {
    let roles = [];
    db.query('SELECT title FROM role', (error, response) => {
        if (error) throw error;

        response.forEach(role => {
            roles.push(role.title);
        })
    })

    return roles;
};

function getEmployees() {
    let firstNames = [];
    let lastNames = [];
    let employees = [];

    db.query('SELECT first_name FROM employee', (error, response) => {
        if (error) throw error;

        response.forEach(first_name => {
            firstNames.push(first_name.first_name);
        });

        db.query('SELECT last_name FROM employee', (error, response) => {
            if (error) throw error;

            response.forEach(last_name => {
                lastNames.push(last_name.last_name);
            });

            for (var i = 0; i < firstNames.length; i++) {
                employees[i] = firstNames[i] + " " + lastNames[i];
            }
        });
    });

    return employees;
}


db.connect(err => {
    if (err) throw err;

    console.log('connected as id ' + db.threadId + '\n');
    console.log('WELCOME TO EMPLOYEE TRACKER! LETS GET STARTED!' + '\n');

    main();
});