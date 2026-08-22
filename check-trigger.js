import pg from 'pg';

const connectionString = "postgres://postgres.seojtutrcwumbmdnqrjn:cx3Xtjq9SDPAKr12@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";
const client = new pg.Client({ connectionString });

async function run() {
  try {
    await client.connect();
    const result = await client.query(`
      SELECT prosrc 
      FROM pg_trigger t
      JOIN pg_proc p ON p.oid = t.tgfoid
      WHERE t.tgname = 'on_auth_user_created';
    `);
    console.log(result.rows[0]?.prosrc || "Trigger not found");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();
