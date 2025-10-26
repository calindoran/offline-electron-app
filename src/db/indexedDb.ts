import Dexie, { type Table } from 'dexie'
import type { QueuedMutation } from '../services/queueService'

export interface PokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokemonAbility {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
  slot: number
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface PokemonSprites {
  front_default: string
  front_shiny?: string
  front_female?: string
  front_shiny_female?: string
  back_default?: string
  back_shiny?: string
  back_female?: string
  back_shiny_female?: string
  other?: {
    'official-artwork'?: {
      front_default: string
    }
  }
}

export interface LocalEntity {
  id: string
  name: string
  updatedAt: number // unix timestamp for delta sync
  notes?: string
  isSynced: boolean
  // Pokemon-specific fields
  sprites?: PokemonSprites
  types?: PokemonType[]
  abilities?: PokemonAbility[]
  height?: number // in decimetres
  weight?: number // in hectograms
  stats?: PokemonStat[]
  base_experience?: number
}

export class AppDatabase extends Dexie {
  items!: Table<LocalEntity>
  mutationQueue!: Table<QueuedMutation>

  constructor() {
    super('OfflineAppDB')
    this.version(1).stores({
      items: 'id, updatedAt', // sample entity table
      mutationQueue: 'id, entity, type, timestamp',
    })
  }
}

export const db = new AppDatabase()
