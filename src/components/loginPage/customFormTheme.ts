import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
            height: '30px',
        
          backgroundColor: 'rgb(47, 45, 62)', // Бэкграунд
          borderRadius: '5px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)', // Тень
          '& .MuiInputBase-root': {
            color: '#646cffaa', // Цвет текста
            // fontWeight: 'bold',
            textShadow: '0 6px 6px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23)', // Тень текста
            height: '15px', // Устанавливаем высоту текстового поля
            padding: '0 8px 12px', // Внутренние отступы
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center', // Вертикальное выравнивание текста
          },
          '& .MuiInputBase-input': {
            padding: '0', // Убираем внутренние отступы текста
            lineHeight: '30px', // Линия текста для центрирования
          },
          '& .MuiInputBase-input::placeholder': {
            padding: '0 5px 12px',
            opacity: 0.6
          },
          '& .MuiInputLabel-root': {
            color: '#646cffaa', // Цвет лейбла
            fontSize: '0.8rem', // Размер текста лейбла
            fontWeight: '800',
            top: '-12px', // Сдвиг лейбла вверх
            left: '5px', // Сдвиг лейбла влево
            '&.Mui-focused': {
            color: '#646cffaa', // Цвет лейбла в состоянии фокуса
            fontSize: '14px',
          },
          },
        },
      },
    },
    MuiInput: {
        styleOverrides: {
          underline: {
            '&:before': {
              borderBottom: 'none', // Убираем линию до фокуса
            },
            '&:hover:not(.Mui-disabled):before': {
              borderBottom: 'none', // Убираем линию при наведении
            },
            '&:after': {
              borderBottom: '2px solid #646cff', // Линия при фокусе
            },
          },
        },
      },
    MuiSelect: {
      styleOverrides: {
        root: {
          height: '30px',
          backgroundColor: 'rgb(47, 45, 62)', // Бэкграунд
          borderRadius: '5px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)', // Тень
          '& .MuiSelect-select': {
            color: '#646cffaa', // Цвет текста
            textShadow: '0 6px 6px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23)', // Тень текста
            padding: '0 8px', // Внутренние отступы
            display: 'flex',
            alignItems: 'center', // Вертикальное выравнивание текста
          },
          '& .MuiSelect-icon': {
            color: '#646cffaa', // Цвет иконки
            top: 'calc(50% - 12px)', // Центрирование иконки
          },
        },
        select: {
          height: '30px', // Высота выпадающего списка
          padding: '0 8px', // Внутренние отступы текста
          display: 'flex',
          alignItems: 'center', // Выравнивание текста
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#646cffaa', // Цвет лейбла
          fontSize: '0.8rem', // Размер текста лейбла
          fontWeight: '800',
          left: '5px', // Сдвиг лейбла влево
          top: '3px', // Сдвиг лейбла вверх
          zIndex: 1,
          '&.Mui-focused': {
            color: '#646cffaa', // Цвет лейбла в состоянии фокуса
            fontSize: '14px',
          },
        },
      },
    },
  },
});

export default customTheme;
