USE employee_db;
INSERT INTO department (id, name) 
VALUES 
    (1, 'IT'),
    (2, 'Platform Services'),
    (3, 'Engineering'),
    (4, 'Finance');
INSERT INTO role (id, title, salary, department_id) 
VALUES 
    (01, 'IT Analyst',43000,001),
    (02, 'Manager',85000,002),
    (03, 'Engineer',120000,003),
    (04, 'Investor',200000,004);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) 
VALUES 
    (1, 'Sam','Patel',01,0001),
    (2, 'Daffy','Duck',02,0002),
    (3, 'Donald','Duck',03,0003),
    (4, 'Scrooge','McDuck',04,0004);


