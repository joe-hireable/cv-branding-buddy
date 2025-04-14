import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

export class QueryBuilder<T extends Database> {
  private query: any;
  private shouldThrow = false;

  constructor(private client: SupabaseClient<T>) {
    this.query = client;
  }

  from<TableName extends keyof T['public']['Tables']>(table: TableName) {
    this.query = this.query.from(table);
    return this;
  }

  select(columns?: string) {
    this.query = this.query.select(columns);
    return this;
  }

  insert<TableName extends keyof T['public']['Tables']>(
    data: T['public']['Tables'][TableName] extends { Insert: any }
      ? T['public']['Tables'][TableName]['Insert']
      : never
  ) {
    this.query = this.query.insert(data);
    return this;
  }

  update<TableName extends keyof T['public']['Tables']>(
    data: T['public']['Tables'][TableName] extends { Update: any }
      ? Partial<T['public']['Tables'][TableName]['Update']>
      : never
  ) {
    this.query = this.query.update(data);
    return this;
  }

  delete() {
    this.query = this.query.delete();
    return this;
  }

  eq(column: string, value: any) {
    this.query = this.query.eq(column, value);
    return this;
  }

  neq(column: string, value: any) {
    this.query = this.query.neq(column, value);
    return this;
  }

  gt(column: string, value: any) {
    this.query = this.query.gt(column, value);
    return this;
  }

  gte(column: string, value: any) {
    this.query = this.query.gte(column, value);
    return this;
  }

  lt(column: string, value: any) {
    this.query = this.query.lt(column, value);
    return this;
  }

  lte(column: string, value: any) {
    this.query = this.query.lte(column, value);
    return this;
  }

  like(column: string, value: string) {
    this.query = this.query.like(column, value);
    return this;
  }

  ilike(column: string, value: string) {
    this.query = this.query.ilike(column, value);
    return this;
  }

  in(column: string, values: any[]) {
    this.query = this.query.in(column, values);
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.query = this.query.order(column, options);
    return this;
  }

  limit(count: number) {
    this.query = this.query.limit(count);
    return this;
  }

  offset(count: number) {
    this.query = this.query.offset(count);
    return this;
  }

  async single() {
    const result = await this.execute();
    return result;
  }

  async maybeSingle() {
    const result = await this.execute();
    return result;
  }

  throwOnError() {
    this.shouldThrow = true;
    this.query = this.query.throwOnError();
    return this;
  }

  async execute() {
    try {
      // Ensure we're properly awaiting the promise chain
      const result = await this.query;
      
      // Handle both direct errors and errors in the result object
      if (this.shouldThrow && result?.error) {
        throw result.error;
      }
      
      return result;
    } catch (error) {
      if (this.shouldThrow) {
        throw error;
      }
      return { data: null, error };
    }
  }
} 