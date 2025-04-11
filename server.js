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

init();

server.use(express.json());
server.use(morgan("dev"));

server.get("api/employees", async (req, res, next) => {
  try{
    const SQL = `SELECT * from employees;`;
    const response = await client.query(SQL);
    res.send(response.rows);
  }catch (error) {
    next(error);
  }
});

server.get("api/departments", async (req, res, next) => {
  try{
    const SQL = `SELECT * from departments;`;
    const response = await client.query(SQL);
    res.send(response.rows);
  }catch (error) {
    next(error);
  }
});

server.post("api/employees", async (req, res, next) => {
  try{
    const { name, department_id} = req.body;
    const SQL = `INSERT INTO employees(name, department_id) VALUES($1, $2) RETURNING *;`
    const response = await client.query(SQL, [
      name,
      department_id
    ]);
    res.send(response.rows[0]);
  }catch (error) {

  }
});

server.delete("api/employees/:id", async (req, res, next) => {
  try{
    const SQL = `DELETE FROM notes WHERE id=$1;`;
    await client.query(SQL, [req.paramds.id]);
    res.sendStatus(204);
  }catch (error) {
    next(error);
  }
});

server.put("api/employees/:id", async (req, res, next) => {
  try{
    const { name, department_id } = req.body;
    const SQL = `UPDATE employees SET name=$1, department_id=$2, updated_at=now() WHERE id=$4 RETURNING *;`;
    const response = await client.query(SQL [
      name,
      department_id,
      req.params.id
    ]);
  }catch (error) {
    next(error);
  }
});

server.use((err, req, res) => {
  res.status(err.statusCode || 500).send({ error: err });
})
