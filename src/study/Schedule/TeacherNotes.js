import React, { useState } from 'react';
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle, CFormInput, CTable, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react';

const TeacherNotes = ({ notes, onAddNote, onDeleteNote }) => {
    const [showModal, setShowModal] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });

    const handleSaveNote = () => {
        onAddNote(newNote);
        setShowModal(false);
        setNewNote({ title: '', content: '' });
    };

    const handleDeleteNote = (noteId) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            onDeleteNote(noteId);
        }
    };

    return (
        <div>
            
            <CTable striped hover>
                <CTableBody>
                    {notes.map((note) => (
                        <CTableRow key={note._id}>
                            <CTableHeaderCell>{note.title}</CTableHeaderCell>
                            <CTableDataCell>{note.content}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="danger" onClick={() => handleDeleteNote(note._id)}>Delete</CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
            <CButton color="primary" onClick={() => setShowModal(true)}>Add Note</CButton>

            <CModal visible={showModal} onClose={() => setShowModal(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Add Teacher Note</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        placeholder="Title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    />
                    <CFormInput
                        placeholder="Content"
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    />
                    <CButton color="primary" onClick={handleSaveNote}>Save</CButton>
                </CModalBody>
            </CModal>
        </div>
    );
};

export default TeacherNotes;
