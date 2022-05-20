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
                        placeholder="Enter your markdown note here:&#10;&#10;Example Markdown Usage:&#10;&#10;;new line : (hit enter key twice)&#10;&#10;$$&#10;Block Math Expression&#10;$$&#10;&#10;$Inline Math Expression$&#10;&#10;# Heading 1&#10;## Heading 2&#10;### Heading 3&#10;#### Heading 4&#10;##### Heading 5&#10;###### Heading 6&#10;####### Heading 7&#10;&#10;*italic*&#10;**bold**&#10;***bold italic***&#10;_underline_&#10;__underline bold__&#10;___underline bold italic___&#10;~~Strikethrough~~&#10;[link](https://www.google.com)&#10;* list item&#10;&#8205;&emsp;- list item&#10;&#8205;&emsp;&emsp;+ list item&#10;&#8205;```code&#10;code&#10;```&#10;&#8205;1. ordered list item&#10;2. ordered list item&#10;&#8205;&emsp;1. ordered list item&#10;&#8205;Math:&#10;&#8205;&emsp;fraction : \frac{1}{2}&#10;&#8205;&emsp;square root : \sqrt{4}&#10;&#8205;&emsp;exponential : e^{i\pi} = -1&#10;&#8205;&emsp;substript : H_{2}O&#10;&#8205;&emsp;complex numbers : \mathbf{1+i}&#10;&#8205;&emsp;trigonometric functions : \sin(x) \cos(x) \tan(x)&#10;&#8205;&emsp;logarithms : \log_2(x) \log_10(x) \log_{10}(x) \log_{2}(x)&#10;&#8205;&emsp;absolute value : \left| \frac{1}{2} \right| = \sqrt{1/2}"
                        defaultValue={note.md}
                        value={text} 
                        class='markdown'
                        onKeyDown={e => {
                            if ( e.key === 'Tab' && !e.shiftKey ) {
                            document.execCommand('insertText', false, "\t");
                            e.preventDefault();
                            return false;
                        }}}
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