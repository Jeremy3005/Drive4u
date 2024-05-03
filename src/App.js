import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import './Chat.css';

const firebaseConfig = {
  apiKey: "AIzaSyAy6sAflV1fu8H3Cd-lbPZ2iqlPXlUVqrc",
  authDomain: "chat-drive-for-you.firebaseapp.com",
  projectId: "chat-drive-for-you",
  storageBucket: "chat-drive-for-you.appspot.com",
  messagingSenderId: "166971855034",
  appId: "1:166971855034:web:1a41863dbbd6c86d313283",
  measurementId: "G-LZXRX50F1X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

const Chat = () => {
  const [mensajes, setMensajes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const messagesEndRef = useRef(null); 

  useEffect(() => {
    const q = query(collection(db, 'mensajes'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nuevosMensajes = [];
      snapshot.forEach((doc) => {
        nuevosMensajes.push({ id: doc.id, texto: doc.data().texto });
      });
      setMensajes(nuevosMensajes);

      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const enviarMensaje = () => {
    if (mensaje.trim()) {
      addDoc(collection(db, 'mensajes'), {
        texto: mensaje,
        timestamp: new Date(),
      });
      setMensaje('');
    }
  };

  return (
    <div className="chat-container"> {}
          <h1 align="center">Chat Interactivo</h1>
      <div className="chat-messages">
        {mensajes.map((msg, index) => (
          <div key={msg.id} className={`chat-message ${index % 2 === 0 ? 'user' : 'other'}`}>
            {msg.texto}
          </div>
        ))}
        <div ref={messagesEndRef} /> {}
      </div>
      <div className="chat-input-container"> {}
        <input
          className="chat-input"
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button className="chat-button" onClick={enviarMensaje}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
