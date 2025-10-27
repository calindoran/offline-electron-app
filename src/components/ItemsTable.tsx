import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Save, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { DataTable } from '@/components/DataTable'
import { PokemonSearch } from '@/components/PokemonSearch'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { LocalEntity } from '../db/indexedDb'
import { useItems } from '../hooks/useItems'
import { useMutateItem } from '../hooks/useMutateItem'
import { Card } from './ui/card'

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500 text-white',
    water: 'bg-blue-500 text-white',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500 text-white',
    ice: 'bg-cyan-300',
    fighting: 'bg-orange-700 text-white',
    poison: 'bg-purple-500 text-white',
    ground: 'bg-yellow-600 text-white',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500 text-white',
    bug: 'bg-lime-500',
    rock: 'bg-yellow-800 text-white',
    ghost: 'bg-purple-700 text-white',
    dragon: 'bg-indigo-700 text-white',
    dark: 'bg-gray-800 text-white',
    steel: 'bg-gray-500 text-white',
    fairy: 'bg-pink-300',
  }
  return colors[type] || 'bg-gray-300'
}

const getStatColor = (stat: number): string => {
  if (stat >= 150) return 'bg-green-600'
  if (stat >= 100) return 'bg-green-500'
  if (stat >= 80) return 'bg-blue-500'
  if (stat >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

interface ItemsTableProps {
  itemId?: string
  onItemClick?: (id: string) => void
  onClose?: () => void
}

export default function ItemsTable({ itemId, onItemClick, onClose }: ItemsTableProps) {
  const { data: items = [] } = useItems()
  const { upsertItem, deleteItem } = useMutateItem()
  const [formData, setFormData] = useState<{ name: string; notes: string }>({
    name: '',
    notes: '',
  })

  const selectedPokemon = itemId ? items.find((item) => item.id === itemId) : null
  const isOpen = !!selectedPokemon

  React.useEffect(() => {
    if (selectedPokemon) {
      setFormData({
        name: selectedPokemon.name,
        notes: selectedPokemon.notes || '',
      })
    }
  }, [selectedPokemon])

  const handleRowClick = (item: LocalEntity) => {
    if (onItemClick) {
      onItemClick(item.id)
    }
  }

  const handleDialogClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPokemon) {
      upsertItem.mutate({
        ...selectedPokemon,
        name: formData.name,
        notes: formData.notes,
        updatedAt: Date.now(),
      })
      handleDialogClose()
    }
  }

  const handleDelete = () => {
    if (selectedPokemon) {
      deleteItem.mutate(selectedPokemon.id)
      handleDialogClose()
    }
  }

  const columns: ColumnDef<LocalEntity>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: (info) => new Date(info.getValue<number>()).toLocaleString(),
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
    },
    {
      accessorKey: 'isSynced',
      header: 'Synced',
      cell: (info) => (info.getValue<boolean>() ? '✅' : '⏳'),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleRowClick(row.original)
              }}
            >
              <Edit size={16} className="mr-1" /> Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation()
                deleteItem.mutate(row.original.id)
              }}
            >
              <Trash2 size={16} className="mr-1" /> Delete
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col h-full gap-6">
      <h1 className="text-3xl font-bold">Pokémon Collection</h1>

      <Card className="p-4">
        <h2 className="mb-4 text-xl font-bold">Add New Pokémon</h2>
        <PokemonSearch />
      </Card>

      <div className="flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={items}
          searchColumn="name"
          additionalSearchColumns={['id']}
          searchPlaceholder="Search your collection by name or ID..."
        />
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Pokémon Details</DialogTitle>
              <DialogDescription>View and edit your Pokémon information.</DialogDescription>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <div className="flex flex-col gap-4 md:flex-row">
                {selectedPokemon?.sprites && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="border-4 border-black rounded-md p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <img
                        src={
                          selectedPokemon.sprites.other?.['official-artwork']?.front_default ||
                          selectedPokemon.sprites.front_default
                        }
                        alt={selectedPokemon.name}
                        className="object-contain w-48 h-48"
                      />
                    </div>
                    {selectedPokemon.sprites.front_shiny && (
                      <div className="p-2 border-4 border-yellow-400 rounded-md bg-yellow-50">
                        <img
                          src={selectedPokemon.sprites.front_shiny}
                          alt={`${selectedPokemon.name} shiny`}
                          className="object-contain w-24 h-24"
                        />
                        <p className="text-xs font-bold text-center">✨ Shiny</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex-1 space-y-4">
                  <div className="p-4 border-2 border-black rounded-md bg-primary/5">
                    <p className="mb-1 text-sm font-bold uppercase text-muted-foreground">
                      Pokédex #
                    </p>
                    <p className="text-2xl font-bold">#{selectedPokemon?.id}</p>
                  </div>

                  {selectedPokemon?.types && selectedPokemon.types.length > 0 && (
                    <div className="p-4 border-2 border-black rounded-md">
                      <p className="mb-2 text-sm font-bold uppercase text-muted-foreground">Type</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPokemon.types.map((typeInfo) => (
                          <span
                            key={typeInfo.slot}
                            className={`px-4 py-2 border-2 border-black rounded-md font-bold uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getTypeColor(typeInfo.type.name)}`}
                          >
                            {typeInfo.type.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {selectedPokemon?.height !== undefined && (
                      <div className="p-4 border-2 border-black rounded-md">
                        <p className="mb-1 text-sm font-bold uppercase text-muted-foreground">
                          Height
                        </p>
                        <p className="text-lg font-bold">
                          {(selectedPokemon.height / 10).toFixed(1)} m
                        </p>
                      </div>
                    )}
                    {selectedPokemon?.weight !== undefined && (
                      <div className="p-4 border-2 border-black rounded-md">
                        <p className="mb-1 text-sm font-bold uppercase text-muted-foreground">
                          Weight
                        </p>
                        <p className="text-lg font-bold">
                          {(selectedPokemon.weight / 10).toFixed(1)} kg
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedPokemon?.abilities && selectedPokemon.abilities.length > 0 && (
                <div className="p-4 border-2 border-black rounded-md">
                  <p className="mb-2 text-sm font-bold uppercase text-muted-foreground">
                    Abilities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPokemon.abilities.map((abilityInfo) => (
                      <span
                        key={abilityInfo.slot}
                        className={`px-3 py-1 border-2 border-black rounded-md text-sm ${abilityInfo.is_hidden ? 'bg-purple-200' : 'bg-blue-200'}`}
                      >
                        {abilityInfo.ability.name.replace('-', ' ')}
                        {abilityInfo.is_hidden && ' (Hidden)'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPokemon?.stats && selectedPokemon.stats.length > 0 && (
                <div className="p-4 border-2 border-black rounded-md">
                  <p className="mb-3 text-sm font-bold uppercase text-muted-foreground">
                    Base Stats
                  </p>
                  <div className="space-y-2">
                    {selectedPokemon.stats.map((statInfo) => (
                      <div key={statInfo.stat.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold capitalize">
                            {statInfo.stat.name.replace('-', ' ')}
                          </span>
                          <span className="font-bold">{statInfo.base_stat}</span>
                        </div>
                        <div className="w-full h-4 overflow-hidden bg-gray-100 border-2 border-black rounded-md">
                          <div
                            className={`h-full ${getStatColor(statInfo.base_stat)}`}
                            style={{ width: `${Math.min((statInfo.base_stat / 255) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedPokemon.base_experience && (
                    <div className="pt-3 mt-3 border-t-2 border-black">
                      <p className="text-sm">
                        <span className="font-bold">Base Experience:</span>{' '}
                        {selectedPokemon.base_experience}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter Pokémon name"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add your personal notes about this Pokémon"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-2 border-black rounded-md">
                  <p className="mb-1 text-sm font-bold uppercase text-muted-foreground">
                    Updated At
                  </p>
                  <p className="text-sm">
                    {selectedPokemon && new Date(selectedPokemon.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 border-2 border-black rounded-md">
                  <p className="mb-1 text-sm font-bold uppercase text-muted-foreground">Synced</p>
                  <p className="text-2xl">{selectedPokemon?.isSynced ? '✅' : '⏳'}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                <Save size={16} className="mr-2" />
                Save
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete}>
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
