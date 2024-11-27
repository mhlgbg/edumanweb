import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = ({ content, setContent }) => {
    const handleEditorChange = (newContent) => {
        setContent(newContent);
    };

    return (
        <Editor
            apiKey="6yg4izainffuk70tgh0zily2rmhvhuetdcdk6k06e292rhkr" // Thay thế bằng API key của bạn
            value={content}
            init={{
                height: 600,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                    'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar:
                    'undo redo | formatselect | image | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | removeformat | help | table',
            }}
            onEditorChange={handleEditorChange}
        />
    );
};

export default TinyMCEEditor;

