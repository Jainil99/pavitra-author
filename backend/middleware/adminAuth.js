const basicAuth = require("express-basic-auth");

function adminAuth() {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;

  if (!user || !pass) {
    throw new Error("Missing ADMIN_USER or ADMIN_PASS in .env");
  }

  return basicAuth({
    users: { [user]: pass },
    challenge: true, // shows browser login popup
    realm: "Pavitra Admin",
  });
}

module.exports = adminAuth;
