const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const app = express();

const sqlConfig = {
  user: "admin",
  password: "",
  database: "WEED_SHOP",
  server: "25.45.242.26",
  port: 49172,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};
app.use(cors());

app.listen(4000, () => {
  console.log("Server is running");
});

async function getWeedSort() {
  await sql.connect(sqlConfig);
  const result = await sql.query`select * from WEED_SORT`;
  return result;
}
async function getCustomers() {
  await sql.connect(sqlConfig);
  const result = await sql.query`select * from CLIENT`;
  return result;
}
async function getFirstQuery(n, t, f) {
  await sql.connect(sqlConfig);
  const result =
    await sql.query`SELECT AGRONOMIST.ID, AGRONOMIST.FIRST_NAME,AGRONOMIST.LAST_NAME, 
  CLIENT.ID,  CLIENT.FIRST_NAME, CLIENT.LAST_NAME 
  FROM AGRONOMIST, CLIENT, PURCHASE
  WHERE CLIENT.ORDERS<=${n} 
  AND PURCHASE.PURCHASE_TIME>=${t} 
  AND PURCHASE.PURCHASE_TIME<=${f};`;
  return result;
}
async function getSecondQuery(t, f) {
  await sql.connect(sqlConfig);
  const result =
    await sql.query`SELECT CLIENT.ID,  CLIENT.FIRST_NAME, CLIENT.LAST_NAME,
  PRODUCT.PRODUCT_NAME,PURCHASE.PURCHASE_TIME
  FROM CLIENT,PRODUCT,PURCHASE
  WHERE PURCHASE_ID=PRODUCT.ID AND PURCHASE.PURCHASE_TIME>=${t} 
  AND PURCHASE.PURCHASE_TIME<=${f};`;
  return result;
}
async function getThirdQuery(n, t, f) {
  await sql.connect(sqlConfig);
  const result =
    await sql.query`SELECT CLIENT.ID,  CLIENT.FIRST_NAME, CLIENT.LAST_NAME
    FROM CLIENT,PURCHASE
    WHERE CLIENT.ORDERS<=${n} 
    AND PURCHASE.PURCHASE_TIME<=${f} 
    AND PURCHASE.PURCHASE_TIME>=${f};`;
  return result;
}
async function getForthQuery(n, t, f) {
  await sql.connect(sqlConfig);
  const result =
    await sql.query`SELECT AGRONOMIST.ID, AGRONOMIST.FIRST_NAME,AGRONOMIST.LAST_NAME
    FROM AGRONOMIST,HARVEST
    WHERE AGRONOMIST.PRODUSED_SORT<=${n} 
    AND AGRONOMIST.ID=HARVEST.AGRONOMIST_ID
    AND HARVEST.HARVEST_DATE>=${t} 
    AND HARVEST.HARVEST_DATE<=${f};`;
  return result;
}
async function getFifthQuery(n, t, f) {
  await sql.connect(sqlConfig);
  const result =
    await sql.query`SELECT AGRONOMIST_DEGUSTATION.AGRONOMIST_ID, CLIENT_DEGUSTATION.ID
    FROM AGRONOMIST_DEGUSTATION,CLIENT_DEGUSTATION
    WHERE AGRONOMIST_DEGUSTATION.ID=CLIENT_DEGUSTATION.ID
    AND CLIENT_DEGUSTATION.DEGUSTATION_DATE>=${t} 
    AND CLIENT_DEGUSTATION.DEGUSTATION_DATE<=${f};`;
  return result;
}
async function getSixthQuery(n, t, f) {
  await sql.connect(sqlConfig);
  const result =
    await sql.query`SELECT CLIENT.FIRST_NAME, CLIENT.LAST_NAME, COUNT(SUGGESTION.SUGGESTION_MESSAGE)
    FROM CLIENT, SUGGESTION
    WHERE CLIENT.ID=SUGGESTION.ID
    AND SUGGESTION.SUGGESTION_TIME<=${f} 
    AND SUGGESTION.SUGGESTION_TIME>=${t};
   `;
  return result;
}
async function getSeventhQuery(n, t, f) {
  await sql.connect(sqlConfig);
  const result =
    await sql.query`SELECT PRODUCT.PRODUCT_NAME
    FROM PRODUCT, PURCHASE, WEED_ORDER, CLIENT
    WHERE PRODUCT.PURCHASE_ID=PURCHASE.ID
    AND PURCHASE.ID=WEED_ORDER.PURCHASE_ID
    AND WEED_ORDER.CLIENT_ID=CLIENT.ID
    AND PURCHASE.PURCHASE_TIME<=${f}
    AND PURCHASE.PURCHASE_TIME>=${f}
    ORDER BY PRODUCT.AMOUNT DESC;
   `;
  return result;
}
app.get("/", async (req, res) => {
  res.send("Test response");
});
app.get("/weed-sort", async (req, res) => {
  res.send(await getWeedSort());
});
app.get("/clients", async (req, res) => {
  res.send(await getCustomers());
});
app.get("/first-query", async (req, res) => {
  const t = req.t;
  const n = req.n;
  const f = req.f;
  res.send(await getFirstQuery(n, t, f));
});
app.get("/second-query", async (req, res) => {
  const t = req.t;
  const f = req.f;
  res.send(await getSecondQuery(t, f));
});
app.get("/third-query", async (req, res) => {
  const t = req.t;
  const n = req.n;
  const f = req.f;
  res.send(await getThirdQuery(n, t, f));
});
app.get("/forth-query", async (req, res) => {
  const t = req.t;
  const n = req.n;
  const f = req.f;
  res.send(await getForthQuery(n, t, f));
});
app.get("/fifth-query", async (req, res) => {
  const t = req.t;
  const n = req.n;
  const f = req.f;
  res.send(await getFifthQuery(n, t, f));
});
app.get("/sixth-query", async (req, res) => {
  const t = req.t;
  const n = req.n;
  const f = req.f;
  res.send(await getSixthQuery(n, t, f));
});

app.get("/seventh-query", async (req, res) => {
  const t = req.t;
  const n = req.n;
  const f = req.f;
  res.send(await getSeventhQuery(n, t, f));
});

