import sqlite3

# Connect to the database (creates a new database if it doesn't exist)
conn = sqlite3.connect("preim.db")

# Create a cursor object to execute SQL commands
cursor = conn.cursor()

# Create the preimages table
cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS preimages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        preimage TEXT NOT NULL
    )
"""
)

# Commit the changes and close the connection
conn.commit()
conn.close()

print("SQLite database with 'preimages' table created successfully!")
