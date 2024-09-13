import { NoSQLClient } from 'oracle-nosqldb';

const client = new NoSQLClient({
  region: process.env.ORACLE_REGION,
  compartment: process.env.ORACLE_COMPARTMENT,
  auth: {
    iam: {
      tenantId: process.env.ORACLE_TENANT_ID,
      userId: process.env.ORACLE_USER_ID,
      fingerprint: process.env.ORACLE_FINGERPRINT,
      privateKey: process.env.ORACLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }
  }
});

export default client;