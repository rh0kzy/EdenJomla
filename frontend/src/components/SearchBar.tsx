import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  Collapse,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useAppStore } from '../store/useAppStore';

interface SearchBarProps {
  onSearch: (query: string, filters: Record<string, any>) => void;
  placeholder?: string;
  filterOptions?: Array<{
    key: string;
    label: string;
    type: 'text' | 'select';
    options?: string[];
  }>;
  initialQuery?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Rechercher...",
  filterOptions = [],
  initialQuery = ''
}: SearchBarProps) {
  const { darkMode } = useAppStore();
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const handleClear = () => {
    setQuery('');
    setFilters({});
    onSearch('', {});
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    if (!value || value === '') {
      delete newFilters[key];
    }
    setFilters(newFilters);
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          size="small"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'action.active' }} />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setQuery('')}>
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              backdropFilter: 'blur(10px)',
              '& fieldset': {
                borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              },
              '&:hover fieldset': {
                borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6366f1',
              },
            },
          }}
        />

        {filterOptions.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              position: 'relative',
              '& .MuiButton-endIcon': {
                ml: 0.5,
              },
            }}
          >
            Filtres
            {activeFiltersCount > 0 && (
              <Chip
                label={activeFiltersCount}
                size="small"
                sx={{
                  ml: 1,
                  height: 16,
                  fontSize: '0.7rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  color: 'white',
                }}
              />
            )}
          </Button>
        )}

        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
            },
          }}
        >
          Rechercher
        </Button>

        {(query || activeFiltersCount > 0) && (
          <Button
            variant="text"
            onClick={handleClear}
            startIcon={<ClearIcon />}
            sx={{ color: 'text.secondary' }}
          >
            Effacer
          </Button>
        )}
      </Box>

      {filterOptions.length > 0 && (
        <Collapse in={showFilters}>
          <Box sx={{ mt: 2, p: 2, borderRadius: 2, background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Filtres avancés
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
              {filterOptions.map((filter) => (
                <Box key={filter.key} sx={{ minWidth: 200, flex: 1 }}>
                  {filter.type === 'text' ? (
                    <TextField
                      fullWidth
                      size="small"
                      label={filter.label}
                      value={filters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        },
                      }}
                    />
                  ) : (
                    <FormControl fullWidth size="small">
                      <InputLabel>{filter.label}</InputLabel>
                      <Select
                        value={filters[filter.key] || ''}
                        label={filter.label}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        sx={{
                          background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        }}
                      >
                        <MenuItem value="">
                          <em>Tous</em>
                        </MenuItem>
                        {filter.options?.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        </Collapse>
      )}
    </Box>
  );
}