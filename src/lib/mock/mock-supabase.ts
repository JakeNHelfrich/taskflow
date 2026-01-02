/**
 * Mock Supabase client for local development
 * Provides the same API as the real Supabase client but uses in-memory storage
 */

import { db, generateId } from './in-memory-db'
import type { Database } from '@/types/database.types'

type TableName = keyof Database['public']['Tables']

// Mock query builder that mimics Supabase's API
class MockQueryBuilder<T extends Record<string, unknown>> {
  private table: Map<string, T>
  private filters: Array<(item: T) => boolean> = []
  private orderByField: string | null = null
  private orderAscending = true
  private limitCount: number | null = null
  private singleResult = false

  constructor(table: Map<string, T>) {
    this.table = table
  }

  select(_fields = '*') {
    // Field selection is simplified - we return all fields
    return this
  }

  eq(field: string, value: unknown) {
    this.filters.push((item) => (item as Record<string, unknown>)[field] === value)
    return this
  }

  neq(field: string, value: unknown) {
    this.filters.push((item) => (item as Record<string, unknown>)[field] !== value)
    return this
  }

  gt(field: string, value: unknown) {
    this.filters.push((item) => (item as Record<string, unknown>)[field]! > value!)
    return this
  }

  gte(field: string, value: unknown) {
    this.filters.push((item) => (item as Record<string, unknown>)[field]! >= value!)
    return this
  }

  lt(field: string, value: unknown) {
    this.filters.push((item) => (item as Record<string, unknown>)[field]! < value!)
    return this
  }

  lte(field: string, value: unknown) {
    this.filters.push((item) => (item as Record<string, unknown>)[field]! <= value!)
    return this
  }

  in(field: string, values: unknown[]) {
    this.filters.push((item) => values.includes((item as Record<string, unknown>)[field]))
    return this
  }

  is(field: string, value: unknown) {
    this.filters.push((item) => (item as Record<string, unknown>)[field] === value)
    return this
  }

  or(_conditions: string) {
    // Simplified OR - just pass through for now
    return this
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderByField = field
    this.orderAscending = options?.ascending ?? true
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  single() {
    this.singleResult = true
    return this
  }

  async then(resolve: (result: { data: T | T[] | null; error: Error | null }) => void) {
    const result = await this.execute()
    resolve(result)
  }

  private async execute(): Promise<{ data: T | T[] | null; error: Error | null }> {
    try {
      let items = Array.from(this.table.values())

      // Apply filters
      for (const filter of this.filters) {
        items = items.filter(filter)
      }

      // Apply ordering
      if (this.orderByField) {
        const field = this.orderByField
        items.sort((a, b) => {
          const aVal = (a as Record<string, unknown>)[field]
          const bVal = (b as Record<string, unknown>)[field]
          if (aVal === bVal) return 0
          const comparison = aVal! < bVal! ? -1 : 1
          return this.orderAscending ? comparison : -comparison
        })
      }

      // Apply limit
      if (this.limitCount !== null) {
        items = items.slice(0, this.limitCount)
      }

      // Return single or multiple
      if (this.singleResult) {
        return { data: items[0] || null, error: null }
      }

      return { data: items, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }
}

// Mock insert builder
class MockInsertBuilder<T extends Record<string, unknown>> {
  private table: Map<string, T>
  private data: Partial<T> | Partial<T>[]
  private shouldSelect = false

  constructor(table: Map<string, T>, data: Partial<T> | Partial<T>[]) {
    this.table = table
    this.data = data
  }

  select() {
    this.shouldSelect = true
    return this
  }

  single() {
    return this
  }

  async then(resolve: (result: { data: T | T[] | null; error: Error | null }) => void) {
    try {
      const now = new Date().toISOString()
      const items = Array.isArray(this.data) ? this.data : [this.data]
      const inserted: T[] = []

      for (const item of items) {
        const id = (item as Record<string, unknown>).id as string || generateId()
        const record = {
          ...item,
          id,
          created_at: now,
          updated_at: now,
        } as unknown as T
        this.table.set(id, record)
        inserted.push(record)
      }

      const result = Array.isArray(this.data) ? inserted : inserted[0]
      resolve({ data: this.shouldSelect ? result! : null, error: null })
    } catch (error) {
      resolve({ data: null, error: error as Error })
    }
  }
}

// Mock update builder
class MockUpdateBuilder<T extends Record<string, unknown>> {
  private table: Map<string, T>
  private updates: Partial<T>
  private filters: Array<(item: T) => boolean> = []
  private shouldSelect = false

  constructor(table: Map<string, T>, updates: Partial<T>) {
    this.table = table
    this.updates = updates
  }

  eq(field: string, value: unknown) {
    this.filters.push((item) => (item as Record<string, unknown>)[field] === value)
    return this
  }

  select() {
    this.shouldSelect = true
    return this
  }

  single() {
    return this
  }

  async then(resolve: (result: { data: T | T[] | null; error: Error | null }) => void) {
    try {
      const now = new Date().toISOString()
      const updated: T[] = []

      for (const [id, item] of this.table.entries()) {
        if (this.filters.every(f => f(item))) {
          const record = {
            ...item,
            ...this.updates,
            updated_at: now,
          } as T
          this.table.set(id, record)
          updated.push(record)
        }
      }

      const result = updated.length === 1 ? updated[0] : updated
      resolve({ data: this.shouldSelect ? result! : null, error: null })
    } catch (error) {
      resolve({ data: null, error: error as Error })
    }
  }
}

// Mock delete builder
class MockDeleteBuilder<T extends Record<string, unknown>> {
  private table: Map<string, T>
  private filters: Array<(item: T) => boolean> = []

  constructor(table: Map<string, T>) {
    this.table = table
  }

  eq(field: string, value: unknown) {
    this.filters.push((item) => (item as Record<string, unknown>)[field] === value)
    return this
  }

  async then(resolve: (result: { data: null; error: Error | null }) => void) {
    try {
      for (const [id, item] of this.table.entries()) {
        if (this.filters.every(f => f(item))) {
          this.table.delete(id)
        }
      }
      resolve({ data: null, error: null })
    } catch (error) {
      resolve({ data: null, error: error as Error })
    }
  }
}

// Table accessor
function getTable(name: TableName): Map<string, Record<string, unknown>> {
  switch (name) {
    case 'profiles':
      return db.profiles as Map<string, Record<string, unknown>>
    case 'projects':
      return db.projects as Map<string, Record<string, unknown>>
    case 'labels':
      return db.labels as Map<string, Record<string, unknown>>
    case 'tasks':
      return db.tasks as Map<string, Record<string, unknown>>
    case 'task_labels':
      return db.taskLabels as Map<string, Record<string, unknown>>
    case 'time_blocks':
      return db.timeBlocks as Map<string, Record<string, unknown>>
    case 'time_block_tasks':
      return db.timeBlockTasks as Map<string, Record<string, unknown>>
    case 'habits':
      return db.habits as Map<string, Record<string, unknown>>
    case 'habit_completions':
      return db.habitCompletions as Map<string, Record<string, unknown>>
    case 'focus_sessions':
      return db.focusSessions as Map<string, Record<string, unknown>>
    default:
      throw new Error(`Unknown table: ${name}`)
  }
}

// Mock Supabase client
export function createMockSupabaseClient() {
  return {
    from: <T extends TableName>(table: T) => {
      const tableMap = getTable(table)
      return {
        select: (fields = '*') => new MockQueryBuilder(tableMap).select(fields),
        insert: (data: Record<string, unknown> | Record<string, unknown>[]) =>
          new MockInsertBuilder(tableMap, data),
        update: (data: Record<string, unknown>) => new MockUpdateBuilder(tableMap, data),
        delete: () => new MockDeleteBuilder(tableMap),
      }
    },
    channel: (_name: string) => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    }),
    removeChannel: () => {},
  }
}

export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>
