const express = require("express");
const pg = require("pg");
const morgan = require("morgan");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/workshop_block33"
);

const server = express();

async function init() {
  await client.connect();
  console.log("connected to database");

  let SQL = `
    DROP TABLE IF EXISTS employees;
    DROP TABLE IF EXISTS departments;
    CREATE TABLE departments(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255)
    );
    CREATE TABLE employees(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      department_id INTEGER REFERENCES departments(id) NOT NULL
    );
  `;

  await client.query(SQL);
  console.log("tables created");

  SQL = `
    INSERT INTO departments(name) VALUES('Engineering');
    INSERT INTO departments(name) VALUES('Accounting');
    INSERT INTO departments(name) VALUES('Sales');

    INSERT INTO employees(name, department_id) VALUES('Craig', (SELECT id FROM departments WHERE name='Engineering'));
    INSERT INTO employees(name, department_id) VALUES('Madie', (SELECT id FROM departments WHERE name='Accounting'));
    INSERT INTO employees(name, department_id) VALUES('Jose', (SELECT id FROM departments WHERE name='Sales'));
  `;

  await client.query(SQL);
  console.log("seeded data");

  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log( `listening on port ${port}`));
}

server.get("api/employees", async (req, res, next) => {
  try{

  }catch (error) {

  }
});

server.get("api/departments", async (req, res, next) => {
  try{

  }catch (error) {

  }
});

server.post("api/employees", async (req, res, next) => {
  try{

  }catch (error) {

  }
});

server.delete("api/employees/:id", async (req, res, next) => {
  try{

  }catch (error) {

  }
});

server.put("api/employees/:id", async (req, res, next) => {
  try{

  }catch (error) {

  }
});

init();
