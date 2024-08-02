import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notes: [],
    isNoteUpdate: false,
    editorNote: null,
    isEditorNote: false,
    deletedNotes: [],
    isDeletedNotes: false
}

const noteSlice = createSlice({
    name: 'note',
    initialState,
    reducers: {
        setNotes: (state, action) => {
            state.notes = action.payload;
        },
        setNoteUpdate: (state, action) => {
            state.isNoteUpdate = action.payload;
        },
        setEditorNote: (state, action) => {
            state.editorNote = action.payload;
            state.isEditorNote = true;
        },
        removeEditorNote: (state) => {
            state.editorNote = null;
            state.isEditorNote = false;
        },
        removeNotes: (state) => {
            state.notes = null;
            state.isEditorNote = false;
        },
        setDeletedNotes: (state, action) => {
            state.deletedNotes = action.payload;
            state.isDeletedNotes = state.deletedNotes.length > 0;
        },
        removeDeletedNotes: (state, action) => {
            state.deletedNotes = [];
            state.isDeletedNotes = state.deletedNotes.length > 0;
        }
        
    }
});

export const { setNotes, setNoteUpdate, removeNotes, setEditorNote, removeEditorNote, setDeletedNotes, removeDeletedNotes } = noteSlice.actions;
export default noteSlice.reducer;