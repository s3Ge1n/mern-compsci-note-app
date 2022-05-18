import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {updateNote} from '../features/notes/noteSlice'
import Spinner from '../components/Spinner'
import {useState} from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css';

function Note() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user} = useSelector((state) => state.auth)
    const {notes, isLoading, isError, message} = useSelector((state) => state.notes)

    useEffect(() => {
        if (isError) {
            console.log(message);
        }

        if (!user) {
            navigate('/login')
        }

        // if(note === undefined) {
        //     toast.error('Note not found')
        //     navigate('/')
        // }

    }, [user, navigate, isError, message, dispatch])

    
    const noteId = window.location.pathname.split('/')[2]

    let note = notes.find((note) => note._id === noteId)

    const [text, setText] = useState(note.md);

    const onSubmit = e => {
        e.preventDefault()

        const noteData = {
            id: note._id,
            text: note.text,
            md: text
        }

        note = dispatch(updateNote(noteData))
        setText(note.md)

    }

    if (isLoading) {
        return <Spinner />
    }

    return <>
    <section className="heading">
        <h1>Welcome {user && user.name}</h1>
        <p>
            <label htmlFor="markdown" className='form-group'>Markdown extended note taking</label>
        </p>
    </section>

    <section className="form">
        <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="text">Extend Note</label>
                    <textarea 
                        type="text" 
                        name='markdown' 
                        id='markdown' 
                        defaultValue={note.md}
                        value={text} 
                        class='markdown'
                        onChange={(e) => setText(e.target.value)}>
                    </textarea>
                </div>
                <div className="form-group">
                    <button className="btn btn-block" type='submit'>
                        Update Extended Note Section
                    </button>
                </div>
            </form>
    </section>
    <section className='content'>
        <h1 className='heading'>{note.text}</h1>
        <p className='Rmd'>
            <ReactMarkdown 
                remarkPlugins={[gfm, remarkMath]} 
                rehypePlugins={[rehypeKatex]}>
                    {note.md}
            </ReactMarkdown>
            </p>
    </section>
</>
}

export default Note