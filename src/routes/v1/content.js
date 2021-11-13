/* eslint-disable indent */
const express = require('express');
const Joi = require('joi');
const mysql = require('mysql2/promise');

const router = express.Router();

const { isLoggedIn } = require('../../middleware');
const { dbConfig } = require('../../config');

const skillsSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

router.get('/skills', isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
        SELECT id, title, description
        FROM skills
    `);
    await con.end();

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'Unexpected error. Please try again.' });
  }
});

router.post('/skills', isLoggedIn, async (req, res) => {
  let skillsData = req.body;
  try {
    skillsData = await skillsSchema.validateAsync(skillsData);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err: 'Incorrect data sent' });
  }

  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
        INSERT INTO skills (user_id, title, description)
        VALUES ('${req.user.id}', ${mysql.escape(
      skillsData.title,
    )}, ${mysql.escape(skillsData.description)})
    `);
    console.log(data);
    await con.end();

    return res.send({ msg: 'Added new skill to account' });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'Unexpected error. Please try again.' });
  }
});

module.exports = router;
