import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../../socket/socket'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styles from './loginPage.module.css'
import { GameModeType } from '../../types';

interface FormValues {
    name: string;
    room: string;
    gameMode: GameModeType;
}

const LoginPage = () => {
    const navigate = useNavigate();
    const [ values, setValues ] = useState<FormValues>({ name: '', room: '', gameMode: 'Standard' });
    const [ error, setError ] = useState('');

    const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent ) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const hendleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        const isDisabled = Object.values(values).some((v) => !v);
        if (isDisabled) return

        e.preventDefault();

        socket.emit('joinRoom', values);

        // Обработка ответа сервера
        socket.once('error', ({ message }) => {
            setError(message);
        });

        socket.on('allowed', () => {
            navigate(`/game?name=${values.name}&room=${values.room}&gameMode=${values.gameMode}`);
        });
    };

  return (
    <div className={styles.wrapper}>
        <div className={styles.container}>
            <h2 className={styles.title}>Join Game</h2>
            <form className={styles.form} onSubmit={hendleSubmit}>
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
                        <MenuItem value={'Blitz'}>Blitz</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <button className={styles.button} type='submit' > Войти в игру </button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    </div>
  )
}

export default LoginPage