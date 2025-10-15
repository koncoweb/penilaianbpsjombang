import { supabase } from "@/integrations/supabase/client";

/**
 * Wraps Supabase queries with timeout to prevent hanging requests
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000,
  errorMessage: string = "Request timeout"
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

/**
 * Helper function to execute Supabase queries with timeout
 */
export async function executeQueryWithTimeout<T>(
  queryFn: () => Promise<T>,
  timeoutMs: number = 10000,
  errorMessage?: string
): Promise<T> {
  try {
    return await withTimeout(queryFn(), timeoutMs, errorMessage);
  } catch (error) {
    console.error("Query timeout or error:", error);
    throw error;
  }
}

/**
 * Wrapper for common Supabase operations with timeout
 */
export const supabaseWithTimeout = {
  async select<T = any>(
    table: string,
    options?: {
      select?: string;
      eq?: { column: string; value: any };
      order?: { column: string; ascending?: boolean };
      timeout?: number;
    }
  ): Promise<{ data: T | null; error: any }> {
    const timeout = options?.timeout || 10000;
    
    try {
      // Start with select (required for query execution)
      let query = supabase
        .from(table)
        .select(options?.select || '*');  // ✅ Always call select
      
      if (options?.eq) {
        query = query.eq(options.eq.column, options.eq.value);
      }
      
      if (options?.order) {
        query = query.order(options.order.column, { 
          ascending: options.order.ascending ?? true 
        });
      }

      // ✅ Execute the query and wrap with timeout
      const result = await withTimeout(
        query,  // This is now a promise that will execute
        timeout,
        `Timeout fetching from ${table}`
      );
      
      return result;
    } catch (error) {
      console.error(`Error querying ${table}:`, error);
      return { data: null, error };
    }
  },

  async insert<T = any>(
    table: string,
    data: T | T[],
    timeout: number = 10000
  ): Promise<{ data: any; error: any }> {
    try {
      const result = await withTimeout(
        supabase.from(table).insert(data).select(),  // ✅ Add .select() to execute query
        timeout,
        `Timeout inserting into ${table}`
      );
      
      return result;
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      return { data: null, error };
    }
  },

  async update<T = any>(
    table: string,
    data: Partial<T>,
    eq: { column: string; value: any },
    timeout: number = 10000
  ): Promise<{ data: any; error: any }> {
    try {
      const result = await withTimeout(
        supabase.from(table).update(data).eq(eq.column, eq.value).select(),  // ✅ Add .select() to execute query
        timeout,
        `Timeout updating ${table}`
      );
      
      return result;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      return { data: null, error };
    }
  },

  async delete(
    table: string,
    eq: { column: string; value: any },
    timeout: number = 10000
  ): Promise<{ data: any; error: any }> {
    try {
      const result = await withTimeout(
        supabase.from(table).delete().eq(eq.column, eq.value),
        timeout,
        `Timeout deleting from ${table}`
      );
      
      return result;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      return { data: null, error };
    }
  }
};
