import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../../socket/socket'
import styles from './loginPage.module.css'

const LoginPage = () => {
    const navigate = useNavigate();
    const [ values, setValues ] = useState({ name: '', room: '' });
    const [error, setError] = useState('');

    const handleInput = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [name]: value });
    }

    const hendleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        const isDisabled = Object.values(values).some((v) => !v);
        if (isDisabled) return

        e.preventDefault();

        socket.emit('joinRoom', values);

        // Обработка ответа сервера
        socket.once('roomFull', ({ message }) => {
        setError(message);
        });

        socket.on('allowed', () => {
            navigate(`/game?name=${values.name}&room=${values.room}`);
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
                    onChange={handleInput}
                    value={values.name}
                    autoComplete='off'
                    required
                />
                <input
                    name='room'
                    className={styles.input}
                    type="text"
                    placeholder='комната'
                    onChange={handleInput}
                    value={values.room}
                    autoComplete='off'
                    required
                />
                <button className={styles.button} type='submit' > Войти в игру </button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    </div>
  )
}

export default LoginPage