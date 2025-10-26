import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/lib/utils'
import { apiClient } from '../services/apiClient'

interface PokemonListItem {
  name: string
  url: string
}

interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export function useSearchPokemon(searchTerm: string, enabled = true) {
  const debouncedSearch = useDebounce(searchTerm.toLowerCase().trim(), 300)

  const { data: allPokemon } = useQuery<PokemonListResponse>({
    queryKey: ['pokemon-list'],
    queryFn: async () => {
      return apiClient.get('/pokemon?limit=10000&offset=0')
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled,
  })

  const filteredPokemon =
    debouncedSearch && allPokemon
      ? allPokemon.results.filter((pokemon) => {
          const pokemonId = pokemon.url.split('/').filter(Boolean).pop() || ''
          return pokemon.name.includes(debouncedSearch) || pokemonId === debouncedSearch
        })
      : []

  return {
    searchResults: filteredPokemon,
    isSearching: debouncedSearch !== searchTerm,
    hasResults: filteredPokemon.length > 0,
    debouncedSearch,
  }
}

export function useFetchPokemon(pokemonIdentifier: string | null) {
  return useQuery({
    queryKey: ['pokemon', pokemonIdentifier],
    queryFn: async () => {
      if (!pokemonIdentifier) return null
      return apiClient.get(`/pokemon/${pokemonIdentifier}`)
    },
    enabled: !!pokemonIdentifier,
  })
}
