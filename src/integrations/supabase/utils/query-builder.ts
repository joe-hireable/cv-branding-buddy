import { createClient } from '../client'
import type { Database } from '../types'

type TableName = keyof Database['public']['Tables']
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row']
type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert']
type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update']

export class QueryBuilder<T extends TableName> {
  private query: any

  constructor(private table: T) {
    this.query = createClient().from(table)
  }

  select(columns: string) {
    this.query = this.query.select(columns)
    return this
  }

  where(column: keyof TableRow<T>, operator: string, value: any) {
    this.query = this.query.eq(column, value)
    return this
  }

  order(column: keyof TableRow<T>, options: { ascending?: boolean } = {}) {
    this.query = this.query.order(column, options)
    return this
  }

  limit(count: number) {
    this.query = this.query.limit(count)
    return this
  }

  single() {
    this.query = this.query.single()
    return this
  }

  async execute() {
    const { data, error } = await this.query
    if (error) throw error
    return data
  }

  static create<T extends TableName>(table: T) {
    return new QueryBuilder<T>(table)
  }
}

export const createQueryBuilder = <T extends TableName>(table: T) => {
  return QueryBuilder.create(table)
} 