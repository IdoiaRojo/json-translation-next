import {Box, Chip, MenuItem, OutlinedInput, Select} from '@mui/material';

export const ChipCustom = ({valueAct, values, handleFieldChange}) => {
  return (
    <Select
      labelId='language-select'
      className={'h-auto w-full bg-white p-2'}
      multiple
      value={valueAct}
      onChange={(e) => {
        handleFieldChange(name, e.target.value);
      }}
      input={<OutlinedInput id='select-language-input' />}
      renderValue={(selected) => (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
          }}
        >
          {selected.map((value: string) => (
            <Chip key={value} label={value} />
          ))}
        </Box>
      )}
    >
      {values &&
        values.length > 0 &&
        values.map((lang: string) => (
          <MenuItem key={lang} value={lang}>
            {lang}
          </MenuItem>
        ))}
    </Select>
  );
};
