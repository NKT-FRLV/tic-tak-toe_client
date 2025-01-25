import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import socket from '../../socket/socket'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styles from './loginPage.module.css'
import { GameModeType } from '../../types';
import Loader from '../../utilComponents/Loader'
import { connectServer } from '../../socket/socket';

interface FormValues {
    name: string;
    room: string;
    gameMode: GameModeType;
}

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [ values, setValues ] = useState<FormValues>({ name: '', room: '', gameMode: 'Standard' });
    const [ error, setError ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
        // console.dir(location)
        if (location.state?.from === '/game') {
          socket.connect();
        }
      }, []);

    const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent ) => {
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
            <form className={styles.form} onSubmit={handleFormSubmit}>
                <input
                    name='name'
                    className={styles.input}
                    type="text"
                    placeholder='имя'
                    onChange={handleChange}
                    value={values.name}
                    autoComplete='off'
                    required
                />
                <input
                    name='room'
                    className={styles.input}
                    type="text"
                    placeholder='комната'
                    onChange={handleChange}
                    value={values.room}
                    autoComplete='off'
                    required
                />
                 <div className={styles.selectWrapper}>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-standard-label">Game Mode</InputLabel>
                        <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={values.gameMode}
                        onChange={handleChange}
                        label="gameMode"
                        name='gameMode'
                        >
                        <MenuItem value={'Standard'}>Standart</MenuItem>
                        <MenuItem value={'Half'}>Half Mode</MenuItem>
                        {/* <MenuItem value={'Blitz'}>Blitz</MenuItem> */}
                        </Select>
                    </FormControl>
                </div>
                <button className={styles.button} onClick={hendleSubmit} type='submit' >
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
            {error ? <p className={styles.error}>{error}</p> : <div className={styles.errorPlaceHolder}></div>}
        </div>
    </div>
  )
}

export default LoginPage