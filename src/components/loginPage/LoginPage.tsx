import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import socket from '../../socket/socket'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { ThemeProvider } from '@mui/material/styles';
import customTheme from './customFormTheme'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import styles from './loginPage.module.css'
import { GameModeType } from '../../types';
import Loader from '../../utilComponents/Loader'
import { connectServer } from '../../socket/socket';

interface FormValues {
    name: string;
    room: string;
    gameMode: GameModeType | '';
}

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [ values, setValues ] = useState<FormValues>({ name: '', room: '', gameMode: '' });
    const [ error, setError ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
        // console.dir(location)
        if (location.state?.from === '/game') {
          socket.connect();
        }
      }, []);

    const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent ) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        if (error) setError('');
        
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    // В идеале бы этот обработчик ставить на тег формы.
    const hendleSubmit = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();
    
        if (!values.name || !values.room || !values.gameMode) {
          setError("Заполните все поля!");
          return;
        }
    
        setIsLoading(true);
        setError("");
    
        try {
          await connectServer(socket);
    
          socket.emit("joinRoom", values);
    
          socket.on("error", ({ message }) => {
            setError(message);
            setIsLoading(false);
          });
    
          socket.on("allowed", () => {
            setIsLoading(false);
            navigate(
              `/game?name=${values.name}&room=${values.room}&gameMode=${values.gameMode}`
            );
          });
        } catch (err: any) {
          setError(err.message);
          setIsLoading(false);
        }
      };

  return (
    <div className={styles.wrapper}>
        <div className={styles.container}>
            <h2 className={styles.title}>Join Game</h2>
            <ThemeProvider theme={customTheme}>
            <form className={styles.form} onSubmit={handleFormSubmit}>
                <TextField
                    label="Name"
                    variant="standard"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    fullWidth
                    autoComplete="no" 
                />
                    <TextField
                    label="Room"
                    variant="standard"
                    name="room"
                    value={values.room}
                    onChange={handleChange}
                    fullWidth
                    sx={{ marginTop: '16px' }} // Отступ между инпутами
                    />
                    <FormControl variant="standard" fullWidth sx={{  minWidth: 120, marginTop: '10px' }}>
                        <InputLabel id="game-mode-label">Game Mode</InputLabel>
                        <Select
                            labelId="game-mode-label"
                            id="demo-simple-select-standard"
                            value={values.gameMode}
                            onChange={handleChange}
                            label="gameMode"
                            name='gameMode'
                        >
                        <MenuItem value={'Standard'}>Standart</MenuItem>
                        <MenuItem value={'Half'}>Half Mode</MenuItem>
                        </Select>
                    </FormControl>
                <button className={styles.button} disabled={isLoading} onClick={hendleSubmit} type='submit' >
                {isLoading ? (
                    <Loader
                        visible={true}
                        height="1rem"
                        width="3.5rem"
                        color="#646cffaa"
                        ariaLabel="three-dots-loading"
                    />)
                    : "Войти в игру"}
                </button>
                
            </form>
            </ThemeProvider>
            {error ? <p className={styles.error}>{error}</p> : <div className={styles.errorPlaceHolder}></div>}
        </div>
    </div>
  )
}

export default LoginPage