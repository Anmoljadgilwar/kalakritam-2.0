import { neon } from "@neondatabase/serverless";

export function createDatabase(env) {
  if (!env?.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const sql = neon(env.DATABASE_URL);

  return {
    async query(text, params = []) {
      try {
        const result = await sql(text, params);
        return { success: true, data: result };
      } catch (error) {
        console.error("Database query error:", { query: text, params, error: error.message, stack: error.stack });
        return { success: false, error: error.message, code: error.code || "UNKNOWN_ERROR" };
      }
    },

    async transaction(queries) {
      try {
        const results = [];
        await sql.transaction(async (trx) => {
          for (const { query, params } of queries) {
            const result = await trx(query, params);
            results.push(result);
          }
        });
        return { success: true, data: results };
      } catch (error) {
        console.error("Transaction error:", error);
        return { success: false, error: error.message };
      }
    },

    async findByEmail(table, email) {
      try {
        const result = await sql`SELECT * FROM ${sql(table)} WHERE LOWER(email) = LOWER(${email}) AND active = true LIMIT 1`;
        return { success: true, data: result.length > 0 ? result[0] : null };
      } catch (error) {
        console.error("Database findByEmail error:", error);
        return { success: false, error: error.message };
      }
    },

    async findById(table, id) {
      try {
        if (!id) return { success: false, error: "ID is required" };
        const result = await sql`SELECT * FROM ${sql(table)} WHERE id = ${id} LIMIT 1`;
        return { success: true, data: result.length > 0 ? result[0] : null };
      } catch (error) {
        console.error("Database findById error:", error);
        return { success: false, error: error.message };
      }
    },

    async insert(table, data, options = {}) {
      try {
        const { onConflict = "error", returning = "*" } = options;
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
        let query = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`;
        if (onConflict === "ignore") query += " ON CONFLICT DO NOTHING";
        else if (onConflict === "update") {
          const updateClause = columns.filter((col) => col !== "id" && col !== "created_at").map((col) => `${col} = EXCLUDED.${col}`).join(", ");
          if (updateClause) query += ` ON CONFLICT (id) DO UPDATE SET ${updateClause}`;
        }
        query += ` RETURNING ${returning}`;
        const result = await sql(query, values);
        return { success: true, data: result.length > 0 ? result[0] : null };
      } catch (error) {
        console.error("Database insert error:", error);
        if (error.code === "23505") return { success: false, error: "Record already exists", code: "DUPLICATE_ERROR" };
        return { success: false, error: error.message };
      }
    },

    async update(table, id, data, options = {}) {
      try {
        const { version = null, returning = "*" } = options;
        const columns = Object.keys(data);
        const values = Object.values(data);
        const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(", ");
        let whereClause = `id = $${values.length + 1}`;
        const queryParams = [...values, id];
        if (version !== null) { whereClause += ` AND version = $${queryParams.length + 1}`; queryParams.push(version); }
        const finalSetClause = `${setClause}, updated_at = NOW()`;
        const query = `UPDATE ${table} SET ${finalSetClause} WHERE ${whereClause} RETURNING ${returning}`;
        const result = await sql(query, queryParams);
        if (result.length === 0) return { success: false, error: version !== null ? "Record was modified by another user" : "Record not found", code: version !== null ? "VERSION_CONFLICT" : "NOT_FOUND" };
        return { success: true, data: result[0] };
      } catch (error) {
        console.error("Database update error:", error);
        return { success: false, error: error.message };
      }
    },

    async delete(table, id, options = {}) {
      try {
        const { hard = false, deletedBy = null } = options;
        if (hard) {
          const result = await sql`DELETE FROM ${sql(table)} WHERE id = ${id} RETURNING *`;
          return { success: true, data: result.length > 0 ? result[0] : null };
        } else {
          const updateData = { deleted_at: new Date().toISOString(), active: false };
          if (deletedBy) updateData.deleted_by = deletedBy;
          return await this.update(table, id, updateData);
        }
      } catch (error) {
        console.error("Database delete error:", error);
        return { success: false, error: error.message };
      }
    },

    async list(table, options = {}) {
      try {
        const { page = 1, limit = 10, where = "", orderBy = "created_at DESC", search = null, searchFields = [], filters = {}, includeDeleted = false } = options;
        const offset = (page - 1) * limit;
        let conditions = [];
        let params = [];
        let paramIndex = 1;
        if (!includeDeleted) conditions.push("(deleted_at IS NULL OR active = true)");
        if (where) conditions.push(where);
        if (search && searchFields.length > 0) {
          const searchConditions = searchFields.map((field) => `LOWER(${field}::text) LIKE LOWER($${paramIndex})`).join(" OR ");
          conditions.push(`(${searchConditions})`);
          params.push(`%${search}%`);
          paramIndex++;
        }
        for (const [field, value] of Object.entries(filters)) {
          if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
              const placeholders = value.map(() => `$${paramIndex++}`).join(", ");
              conditions.push(`${field} IN (${placeholders})`);
              params.push(...value);
            } else { conditions.push(`${field} = $${paramIndex++}`); params.push(value); }
          }
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        const baseQuery = `FROM ${table} ${whereClause}`;
        const dataQuery = `SELECT * ${baseQuery} ORDER BY ${orderBy} LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
        const [data, countResult] = await Promise.all([sql(dataQuery, [...params, limit, offset]), sql(countQuery, params)]);
        const total = parseInt(countResult[0].total);
        const totalPages = Math.ceil(total / limit);
        return { success: true, data, pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } };
      } catch (error) {
        console.error("Database list error:", error);
        return { success: false, error: error.message };
      }
    },

    async bulkInsert(table, records, options = {}) {
      try {
        const { batchSize = 100, onConflict = "error" } = options;
        const results = [];
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          const batchResults = await Promise.all(batch.map((record) => this.insert(table, record, { onConflict })));
          results.push(...batchResults);
        }
        return { success: true, data: results };
      } catch (error) {
        console.error("Bulk insert error:", error);
        return { success: false, error: error.message };
      }
    },

    async healthCheck() {
      try {
        const result = await sql`SELECT 1 as health_check, NOW() as timestamp`;
        return { success: true, data: { status: "healthy", timestamp: result[0].timestamp, connection: "active" } };
      } catch (error) {
        console.error("Database health check error:", error);
        return { success: false, error: error.message, data: { status: "unhealthy", connection: "failed" } };
      }
    },

    async getStats() {
      try {
        const queries = [
          "SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del FROM pg_stat_user_tables",
          "SELECT COUNT(*) as active_connections FROM pg_stat_activity WHERE state = 'active'",
          "SELECT pg_database_size(current_database()) as db_size"
        ];
        const [tableStats, connectionStats, sizeStats] = await Promise.all(queries.map((q) => sql(q)));
        return { success: true, data: { tables: tableStats, active_connections: connectionStats[0].active_connections, database_size: sizeStats[0].db_size } };
      } catch (error) {
        console.error("Database stats error:", error);
        return { success: false, error: error.message };
      }
    }
  };
}
