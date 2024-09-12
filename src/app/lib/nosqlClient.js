import { NoSQLClient } from 'oracle-nosqldb';
import fs from 'fs';
import path from 'path';

const client = new NoSQLClient({
  region: process.env.ORACLE_REGION,
  compartment: process.env.ORACLE_COMPARTMENT,
  auth: {
    iam: {
      tenantId: process.env.ORACLE_TENANT_ID,
      userId: process.env.ORACLE_USER_ID,
      fingerprint: process.env.ORACLE_FINGERPRINT,
      privateKey: fs.readFileSync(path.resolve(process.cwd(), process.env.ORACLE_PRIVATE_KEY_PATH), 'utf8')
    }
  }
});

export default client;