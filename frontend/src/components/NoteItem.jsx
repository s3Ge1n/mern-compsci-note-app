import {useDispatch} from 'react-redux';
import { useState } from 'react';
import CustomPopup from './CustomPopup';
import {deleteNote, updateNote} from '../features/notes/noteSlice';
import {FaPencilAlt} from 'react-icons/fa'
import {toast} from 'react-toastify'

function NoteItem({note}) {
    const [visibility, setVisibility] = useState(false);
    const [text, setText] = useState('');
    const dispatch = useDispatch()

    const popupCloseHandler = (e) => {
        setVisibility(e);
    };

    const onSubmit = e => {
        e.preventDefault()

        if(text === '') {
            toast.error('Nothing to update')
        } else {

        const noteData = {
            id: note._id,
            text: text
        }
        dispatch(updateNote(noteData))
        setText('')
    }
    }

    return (
        <div className="note">
            <div>
                {new Date(note.createdAt).toLocaleDateString('en-US')}
            </div>
            <h2>{note.text}</h2>
            <button onClick={() => dispatch(deleteNote(note._id))} className="close">X</button>
            <button onClick={(e) => setVisibility(!visibility)} className="update"><FaPencilAlt /></button>

            <CustomPopup 
                show={visibility} 
                onClose={popupCloseHandler} 
                title="Update note">
                    <section className="form">
                        <form onSubmit={onSubmit}>
                            <div className="form-group">
                                <label htmlFor="text">Note</label>
                                <input defaultValue={note.text} onChange={(e) => setText(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <button className="btn btn-block" type='submit'>
                                    Update Note
                                </button>
                            </div>
                            </form>
                    </section>
            </CustomPopup>
        </div>
    )
}

export default NoteItem