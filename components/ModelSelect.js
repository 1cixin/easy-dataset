'use client';

import React, { useEffect, useState } from 'react';
import { FormControl, Select, MenuItem, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAtom, useAtomValue } from 'jotai/index';
import { modelConfigListAtom, selectedModelInfoAtom } from '@/lib/store';

export default function ModelSelect({ size = 'small', minWidth = 180 }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const models = useAtomValue(modelConfigListAtom);
  const [selectedModelInfo, setSelectedModelInfo] = useAtom(selectedModelInfoAtom);
  const [selectedModel, setSelectedModel] = useState(selectedModelInfo ? selectedModelInfo : models[0]?.id || '');
  const handleModelChange = event => {
    if (!event || !event.target) return;
    const newModelId = event.target.value;

    // 找到选中的模型对象
    const selectedModelObj = models.find(model => model.id === newModelId);
    if (selectedModelObj) {
      setSelectedModel(newModelId);
      // 将完整的模型信息存储到 localStorage
      setSelectedModelInfo(selectedModelObj);
    } else {
      setSelectedModelInfo({
        id: newModelId
      });
    }
  };

  return (
    <FormControl size={size} sx={{ minWidth }}>
      <Select
        value={selectedModel}
        onChange={handleModelChange}
        displayEmpty
        variant="outlined"
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.15)',
          color: theme.palette.mode === 'dark' ? 'inherit' : 'white',
          borderRadius: '8px',
          '& .MuiSelect-icon': {
            color: theme.palette.mode === 'dark' ? 'inherit' : 'white'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main'
          }
        }}
        MenuProps={{
          PaperProps: {
            elevation: 2,
            sx: { mt: 1, borderRadius: 2 }
          }
        }}
      >
        <MenuItem value="" disabled>
          {t('playground.selectModelFirst')}
        </MenuItem>
        {models
          .filter(m => {
            if (m.providerId.toLowerCase() === 'ollama') {
              return m.modelName && m.endpoint;
            } else {
              return m.modelName && m.endpoint && m.apiKey;
            }
          })
          .map(model => (
            <MenuItem key={model.id} value={model.id}>
              {model.providerName}: {model.modelName}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
