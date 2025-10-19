import { sql } from "./db"

// Function to execute a custom SQL query
export async function executeCustomQuery(query: string, params: any[] = []) {
  try {
    const result = await sql.query(query, params)
    return result.rows
  } catch (error) {
    console.error("Error executing SQL query:", error)
    throw new Error("Failed to execute SQL query")
  }
}

// Example function to create a table
export async function createTable(tableName: string, columns: string[]) {
  const columnsDefinition = columns.join(", ")
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsDefinition})`

  try {
    await sql.query(query)
    return { success: true, message: `Table ${tableName} created successfully` }
  } catch (error) {
    console.error("Error creating table:", error)
    throw new Error(`Failed to create table ${tableName}`)
  }
}

// Example function to insert data
export async function insertData(tableName: string, data: Record<string, any>[]) {
  if (data.length === 0) return { success: true, message: "No data to insert" }

  const columns = Object.keys(data[0])
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ")
  const query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`

  try {
    for (const row of data) {
      const values = columns.map((col) => row[col])
      await sql.query(query, values)
    }
    return { success: true, message: `Data inserted into ${tableName} successfully` }
  } catch (error) {
    console.error("Error inserting data:", error)
    throw new Error(`Failed to insert data into ${tableName}`)
  }
}
