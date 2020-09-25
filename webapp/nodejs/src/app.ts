import express from "express";
import * as grpc from "grpc";
import mysql from "promise-mysql";
import crypto from 'crypto';

import {InitializeRequest, InitializeResponse} from "./proto/xsuportal/services/admin/initialize_pb";
import {Error} from "./proto/xsuportal/error_pb";

const TEAM_CAPACITY = 10
const MYSQL_ER_DUP_ENTRY = 1062
const ADMIN_ID = 'admin'
const ADMIN_PASSWORD = 'admin'
const DEBUG_CONTEST_STATUS_FILE_PATH = '/tmp/XSUPORTAL_CONTEST_STATUS'
const hash = crypto.createHash('sha256');

const db = await mysql.createConnection({
  host: process.env['MYSQL_HOSTNAME'] ?? '127.0.0.1',
  port: Number.parseInt(process.env['MYSQL_PORT'] ?? '3306'),
  user: process.env['MYSQL_USER'] ?? 'isucon',
  database: process.env['MYSQL_DATABASE'] ?? 'xsuportal',
  password: process.env['MYSQL_PASS'] || 'isucon',
  charset: 'utf8mb4',
});

const app = express();

app.use(express.static("../public"));
// TODO session

// rawbody
app.use(function(req, res, next) {
  req.body = '';
  req.on('data', function(chunk) { 
    req.body += chunk;
  });
  req.on('end', function() {
    next();
  });
});

app.post("/initialize", async (req, res, next) => {
  const request = InitializeRequest.deserializeBinary(Buffer.from(req.body));
  await db.query('TRUNCATE `teams`');
  await db.query('TRUNCATE `contestants`')
  await db.query('TRUNCATE `benchmark_jobs`')
  await db.query('TRUNCATE `clarifications`')
  await db.query('TRUNCATE `notifications`')
  await db.query('TRUNCATE `push_subscriptions`')
  await db.query('TRUNCATE `contest_config`')

  await db.query(
    'INSERT `contestants` (`id`, `password`, `staff`, `created_at`) VALUES (?, ?, TRUE, NOW(6))',
    [ADMIN_ID, hash.update(ADMIN_PASSWORD).copy().digest("hex")]
  )
  
  const contest = request.getContest();
  if (contest) {
    const openAt = contest.getRegistrationOpenAt();
    if (openAt == null) {
      // TODO error handle
      return new Error().setCode(400);
    }
    await db.query(`INSERT contest_config (registration_open_at, contest_starts_at, contest_freezes_at, contest_ends_at) VALUES (?, ?, ?, ?)`, [
      new Date(openAt.getSeconds()).toUTCString(),
    ]);
  } else {
    // TODO

  }
});

