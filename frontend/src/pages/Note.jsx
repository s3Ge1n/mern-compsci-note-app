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
                        placeholder="Enter your markdown note here:
                        Example Markdown Usage:

                        new line : (hit enter key twice)

                        $$
                        Block Math Expression
                        $$

                        $Inline Math Expression$
                        
                        # Heading 1
                        ## Heading 2
                        ### Heading 3
                        #### Heading 4
                        ##### Heading 5
                        ###### Heading 6
                        ####### Heading 7
                        *italic*
                        **bold**
                        [link](https://www.google.com)
                        * list item
                            - list item
                                + list item
                        ~~Strikethrough~~
                        ```code
                        code
                        ```
                        1. ordered list item
                        2. ordered list item

                        Math:
                            fraction : \\frac{1}{2}
                            square root : \\sqrt{4}
                            exponential : e^{i\\pi} = -1
                            substript : H_{2}O
                            complex numbers : \\mathbf{1+i}
                            trigonometric functions : \\sin(x) \\cos(x) \\tan(x)
                            logarithms : \\log_2(x) \\log_10(x) \\log_{10}(x) \\log_{2}(x)
                            absolute value : \\left| \\frac{1}{2} \\right| = \\sqrt{1/2}

                        "
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