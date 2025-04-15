import { supabase } from '../client'
import { handleError } from './error-handler'

export class MigrationManager {
  private client = supabase

  async createMigration(name: string, up: string, down: string) {
    const { data, error } = await this.client
      .from('migrations')
      .insert({
        name,
        up_sql: up,
        down_sql: down,
        status: 'pending'
      })
      .select()
      .single()

    if (error) handleError(error)
    return data
  }

  async getPendingMigrations() {
    const { data, error } = await this.client
      .from('migrations')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) handleError(error)
    return data
  }

  async getAppliedMigrations() {
    const { data, error } = await this.client
      .from('migrations')
      .select('*')
      .eq('status', 'applied')
      .order('created_at', { ascending: true })

    if (error) handleError(error)
    return data
  }

  async applyMigration(id: string) {
    const { data: migration, error: fetchError } = await this.client
      .from('migrations')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) handleError(fetchError)
    if (!migration) throw new Error('Migration not found')

    try {
      // Execute the up migration
      const { error: executeError } = await this.client.rpc('exec_sql', {
        sql: migration.up_sql
      })

      if (executeError) throw executeError

      // Update migration status
      const { error: updateError } = await this.client
        .from('migrations')
        .update({ status: 'applied', applied_at: new Date().toISOString() })
        .eq('id', id)

      if (updateError) throw updateError

      return migration
    } catch (error) {
      // Update migration status to failed
      await this.client
        .from('migrations')
        .update({ 
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', id)

      throw error
    }
  }

  async rollbackMigration(id: string) {
    const { data: migration, error: fetchError } = await this.client
      .from('migrations')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) handleError(fetchError)
    if (!migration) throw new Error('Migration not found')

    try {
      // Execute the down migration
      const { error: executeError } = await this.client.rpc('exec_sql', {
        sql: migration.down_sql
      })

      if (executeError) throw executeError

      // Update migration status
      const { error: updateError } = await this.client
        .from('migrations')
        .update({ status: 'pending', applied_at: null })
        .eq('id', id)

      if (updateError) throw updateError

      return migration
    } catch (error) {
      // Update migration status to failed
      await this.client
        .from('migrations')
        .update({ 
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', id)

      throw error
    }
  }
}

export const migrationManager = new MigrationManager() 