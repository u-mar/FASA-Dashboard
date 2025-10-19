import { neon } from "@neondatabase/serverless"

// Create a SQL client for your local PostgreSQL database
// You can replace this with your specific connection string
export const sql = neon(
  "postgresql://neondb_owner:npg_Fc7HrkYNG9qx@ep-sweet-brook-abh5tm6q-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require",
)
