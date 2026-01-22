import database from "infra/database.js";

async function status(req, res) {
  const updateAt = new Date().toISOString();

  const dbVersion = await database.query("SHOW server_version;");
  const dbVersionValue = dbVersion.rows[0].server_version;

  const dbMaxConnections = await database.query("SHOW max_connections;");
  const dbMaxConnectionsValue = dbMaxConnections.rows[0].max_connections;

  const nameDatabase = process.env.POSTGRES_DB;

  const dbConnectiosActivity = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1 AND state = 'active';",
    values: [nameDatabase],
  });
  const dbConnectiosActivityValue = dbConnectiosActivity.rows[0].count;

  res.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: dbVersionValue,
        max_connections: parseInt(dbMaxConnectionsValue),
        opened_connections: parseInt(dbConnectiosActivityValue),
      },
    },
  });
}

export default status;
