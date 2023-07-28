import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// import './nav.css';

function EditNote() {
  const { id } = useParams();

  const [note, setNote] = useState({
    title: " ",
    content: " ",
    date: " ",
    id: " "
  });

  const navigate = useNavigate(); // Use navigate instead of history

  useEffect(() => {
    const getNote = async () => {
      const token = localStorage.getItem('tokenStore');
      if (id) {
        const res = await axios.get(`https://priyadharshini-notes-app.vercel.app/api/notes/${id}`, {
          headers: { Authorization: token }
        });
        setNote({
          title: res.data.title,
          content: res.data.content,
          date: new Date(res.data.date).toLocaleDateString(),
          id: res.data._id
        });
      }
    };

    getNote();
  }, [id]);

  const onChaneInput = e => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value });
  };

  const editNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('tokenStore');
      if (token) {
        const { title, content, date, id } = note;
        const newNote = {
          title,
          content,
          date
        };

        await axios.put(`https://priyadharshini-notes-app.vercel.app/api/notes/${id}`, newNote, {
          headers: { Authorization: token }
        });

        // Navigate to home page after successful note edit.
        navigate('/'); // Use navigate function to redirect
      }
    } catch (err) {
      console.error('Error editing note:', err);
      // Set an error state or display the error message on the page.
      // For example:
      // setError('Failed to edit note. Please try again later.');
    }
  };

  return (
    <div className="create-note">
      <h2>Edit note</h2>

      <form onSubmit={editNote} autoComplete='off'>
        <div className="row">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id='title'
            name="title"
            value={note.title}
            required
            onChange={onChaneInput}
          />
        </div>

        <div className="row">
          <label htmlFor="content">Content</label>
          <textarea
            cols="30"
            rows="10"
            type="textarea"
            id='content'
            name="content"
            value={note.content}
            required
            onChange={onChaneInput}
          ></textarea>
        </div>

        <label htmlFor="date">Date:{note.date}</label>
        <div className="row">
          <input
            type="date"
            id='date'
            name="date"
            onChange={onChaneInput}
          />
        </div>

        <button type='submit'>save</button>
      </form>
    </div>
  );
}

export default EditNote;
