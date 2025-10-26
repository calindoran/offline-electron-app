import { Loader2, Plus, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutateItem } from '../hooks/useMutateItem'
import { useFetchPokemon, useSearchPokemon } from '../hooks/useSearchPokemon'

export function PokemonSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(null)
  const { searchResults, isSearching, hasResults } = useSearchPokemon(searchTerm)
  const { data: selectedPokemon, isLoading: isLoadingPokemon } =
    useFetchPokemon(selectedPokemonName)
  const { upsertItem } = useMutateItem()

  const handleAddPokemon = () => {
    if (!selectedPokemon) return

    upsertItem.mutate({
      id: selectedPokemon.id.toString(),
      name: selectedPokemon.name,
      notes: '',
      isSynced: false,
      updatedAt: Date.now(),
      sprites: selectedPokemon.sprites,
      types: selectedPokemon.types,
      abilities: selectedPokemon.abilities,
      stats: selectedPokemon.stats,
      height: selectedPokemon.height,
      weight: selectedPokemon.weight,
      base_experience: selectedPokemon.base_experience,
    })

    setSearchTerm('')
    setSelectedPokemonName(null)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search Pokémon by name or ID (e.g., pikachu, 25, charizard, 6)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setSelectedPokemonName(null)
          }}
          className="pl-10 pr-8"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('')
              setSelectedPokemonName(null)
            }}
            className="absolute transition-colors transform -translate-y-1/2 right-2 top-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isSearching && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Searching...</span>
        </div>
      )}

      {searchTerm && !isSearching && hasResults && (
        <div className="border-2 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-64 overflow-auto">
          <div className="divide-y-2 divide-black">
            {searchResults.slice(0, 10).map((pokemon) => (
              <button
                type="button"
                key={pokemon.name}
                className="flex items-center justify-between w-full px-4 py-3 text-left transition-colors hover:bg-primary/5"
                onClick={() => setSelectedPokemonName(pokemon.name)}
              >
                <span className="font-medium capitalize">{pokemon.name}</span>
                <span className="text-sm text-muted-foreground">
                  #{pokemon.url.split('/').filter(Boolean).pop()}
                </span>
              </button>
            ))}
            {searchResults.length > 10 && (
              <div className="px-4 py-2 text-sm text-center text-muted-foreground bg-secondary/50">
                {searchResults.length - 10} more results... Type more to refine search
              </div>
            )}
          </div>
        </div>
      )}

      {searchTerm && !isSearching && !hasResults && (
        <div className="py-8 text-center text-muted-foreground">
          No Pokémon found matching "{searchTerm}"
        </div>
      )}

      {isLoadingPokemon && (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading Pokémon details...</span>
        </div>
      )}

      {selectedPokemon && !isLoadingPokemon && (
        <div className="border-2 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              {selectedPokemon.sprites?.other?.['official-artwork']?.front_default && (
                <img
                  src={selectedPokemon.sprites.other['official-artwork'].front_default}
                  alt={selectedPokemon.name}
                  className="object-contain w-32 h-32 border-2 border-black rounded-md"
                />
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-2xl font-bold capitalize">{selectedPokemon.name}</h3>
                <p className="text-sm text-muted-foreground">#{selectedPokemon.id}</p>
              </div>
              {selectedPokemon.types && (
                <div className="flex flex-wrap gap-2">
                  {selectedPokemon.types.map(
                    (typeInfo: { slot: number; type: { name: string } }) => (
                      <span
                        key={typeInfo.slot}
                        className="px-3 py-1 text-xs font-bold uppercase border-2 border-black rounded-md"
                      >
                        {typeInfo.type.name}
                      </span>
                    )
                  )}
                </div>
              )}
              <Button onClick={handleAddPokemon} disabled={upsertItem.isPending}>
                <Plus className="w-4 h-4 mr-2" />
                Add to Collection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
