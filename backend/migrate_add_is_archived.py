import psycopg2

conn = psycopg2.connect(
    dbname="gateway_academy",
    user="postgres",
    password="0000",
    host="localhost",
    port="5432"
)
conn.autocommit = True
cur = conn.cursor()

# Add is_archived column if it doesn't exist
cur.execute("""
    ALTER TABLE enquiries
    ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;
""")

print("SUCCESS: Column 'is_archived' added (or already existed) on 'enquiries' table.")

cur.close()
conn.close()
