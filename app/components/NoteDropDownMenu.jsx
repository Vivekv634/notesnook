'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Check,
  Code,
  Copy,
  Heading,
  Printer,
  RotateCcw,
  SquareArrowOutUpRight,
  Trash2,
  Type,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setDeletedNotes, setNotes } from '../redux/slices/noteSlice';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { uid } from 'uid';
import { usePathname } from 'next/navigation';
import editorJsToHtml from '../utils/editorJSToHTML';
import { useState } from 'react';
import CopyAsHTMLDialog from './CopyAsHTMLDialog';
import CopyAsMarkdownDialog from './CopyAsMarkdownDialog';
import CopyAsTextDialog from './CopyAsTextDialog';
import ExportAsTextDialog from './ExportAsTextDialog';
import ExportAsMarkdownDialog from './ExportAsMarkdownDialog';
import ExportAsHTMLDialog from './ExportAsHTMLDialog';

const NoteDropDownMenu = ({ note, notesDocID, children }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const [copyAsHTML, setCopyAsHTML] = useState(false);
  const [copyAsText, setCopyAsText] = useState(false);
  const [copyAsMarkdown, setCopyAsMarkdown] = useState(false);
  const [exportAsHTML, setExportAsHTML] = useState(false);
  const [exportAsText, setExportAsText] = useState(false);
  const [exportAsMarkdown, setExportAsMarkdown] = useState(false);

  const setEditorNoteState = () => {
    router.push(`/dashboard/${notesDocID}/${note.noteID}`);
  };

  const updateNote = async (props) => {
    let body, toastMessage;
    switch (props) {
      case 'isPinned':
        body = { isPinned: !note.isPinned };
        toastMessage = {
          description: !note.isPinned ? 'Note pinned!' : 'Note unpinned!',
        };
        break;
      case 'isReadOnly':
        body = { isReadOnly: !note.isReadOnly };
        toastMessage = {
          description: !note.isReadOnly
            ? 'Note marked as read-only!'
            : 'Note is editable again!',
        };
        break;
      case 'moveToTrash':
        body = { isTrash: !note.isTrash };
        toastMessage = { description: 'Note moved to trash!' };
        break;
      default:
        body = { isFavorite: !note.isFavorite };
        toastMessage = {
          description: !note.isFavorite
            ? 'Note added to favorites!'
            : 'Note removed from favorites!',
        };
        break;
    }
    try {
      const response = await axios.put(
        `${process.env.API}/api/notes/update/${note.noteID}`,
        body,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      dispatch(setNotes(response.data.result));
      toast({ ...toastMessage, className: 'bg-green-500 text-white' });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! Something went wrong. Try again!',
        variant: 'destructive',
      });
    }
  };

  const restoreNote = async () => {
    try {
      const body = { isTrash: false };
      const restoreResponse = await axios.put(
        `${process.env.API}/api/notes/update/${note.noteID}`,
        body,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      dispatch(setNotes(restoreResponse.data.result));
      let filterDeletedNotes = restoreResponse.data.result.filter(
        (note) => note.isTrash === true,
      );
      dispatch(setDeletedNotes(filterDeletedNotes));
      toast({ description: 'Note restored!' });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! Something went wrong. Try again!',
        variant: 'destructive',
      });
    }
  };

  const deleteNote = async () => {
    try {
      const deleteResponse = await axios.delete(
        `${process.env.API}/api/notes/delete/${note.noteID}`,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      const filterDeletedNotes = deleteResponse.data.result.filter(
        (note) => note.isTrash === true,
      );
      dispatch(setDeletedNotes(filterDeletedNotes));
      toast({ description: 'Note deleted forever!' });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! Something went wrong. Try again!',
        variant: 'destructive',
      });
    }
  };

  const duplicateNote = async () => {
    let body = { ...note, updation_date: new Date().toString(), noteID: uid() };
    const duplicateResponse = await axios.post(
      `${process.env.API}/api/notes/create`,
      body,
      {
        headers: {
          notesDocID: notesDocID,
        },
      },
    );
    dispatch(setNotes(duplicateResponse.data.result));
    toast({ description: 'Note duplicated!', className: 'bg-green-500' });
  };

  const handleCopyAsMarkdown = () => {
    setCopyAsMarkdown(true);
  };

  const handleCopyAsHTML = () => {
    setCopyAsHTML(true);
  };

  const handleCopyAsText = () => {
    setCopyAsText(true);
  };

  const handleExportAsMarkdown = () => {
    setExportAsMarkdown(true);
  };

  const handleExportAsHTML = () => {
    setExportAsHTML(true);
  };

  const handleExportAsText = () => {
    setExportAsText(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      {pathName.split('/')[2] != 'trash' ? (
        <DropdownMenuContent className="w-44 mr-2">
          <DropdownMenuItem
            className="flex justify-between items-center"
            onClick={setEditorNoteState}
          >
            Edit <SquareArrowOutUpRight className="h-4 w-5" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex justify-between items-center"
            onClick={() => updateNote('isPinned')}
          >
            Pin
            {note.isPinned && <Check className="h-4 w-5" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex justify-between items-center"
            onClick={() => updateNote('isReadOnly')}
          >
            Read Only
            {note.isReadOnly && <Check className="h-4 w-5" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex justify-between items-center"
            onClick={() => updateNote('isFavorite')}
          >
            Favorite
            {note.isFavorite && <Check className="h-4 w-5" />}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex justify-between items-center">
            Print
            <Printer className="h-4 w-5" />
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Export as</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className="flex justify-between items-center"
                onClick={handleExportAsMarkdown}
              >
                Markdown
                <Heading className="h-4 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center"
                onClick={handleExportAsHTML}
              >
                HTML
                <Code className="h-4 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center"
                onClick={handleExportAsText}
              >
                Text
                <Type className="h-4 w-5" />
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Copy as</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className="flex justify-between items-center"
                onClick={handleCopyAsMarkdown}
              >
                Markdown
                <Heading className="h-4 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center"
                onClick={handleCopyAsHTML}
              >
                HTML
                <Code className="h-4 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex justify-between items-center"
                onClick={handleCopyAsText}
              >
                Text
                <Type className="h-4 w-5" />
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem
            className="flex justify-between items-center"
            onClick={duplicateNote}
          >
            Duplicate
            <Copy className="h-4 w-5" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex justify-between items-center text-red-500"
            onClick={() => updateNote('moveToTrash')}
          >
            Move to Trash
            <Trash2 className="h-4 w-5" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent className="w-44">
          <DropdownMenuItem
            className="flex justify-between items-center"
            onClick={restoreNote}
          >
            Restore
            <RotateCcw className="h-4 w-5" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex justify-between items-center text-red-500"
            onClick={deleteNote}
          >
            Delete forever
            <Trash2 className="h-4 w-5" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
      <CopyAsHTMLDialog
        html={editorJsToHtml(JSON.parse(note.body).blocks)}
        open={copyAsHTML}
        setOpen={setCopyAsHTML}
      />
      <CopyAsMarkdownDialog
        html={editorJsToHtml(JSON.parse(note.body).blocks)}
        open={copyAsMarkdown}
        setOpen={setCopyAsMarkdown}
      />
      <CopyAsTextDialog
        html={editorJsToHtml(JSON.parse(note.body).blocks)}
        open={copyAsText}
        setOpen={setCopyAsText}
      />
      <ExportAsTextDialog
        noteTitle={note.title}
        html={editorJsToHtml(JSON.parse(note.body).blocks)}
        open={exportAsText}
        setOpen={setExportAsText}
      />
      <ExportAsMarkdownDialog
        noteTitle={note.title}
        html={editorJsToHtml(JSON.parse(note.body).blocks)}
        open={exportAsMarkdown}
        setOpen={setExportAsMarkdown}
      />
      <ExportAsHTMLDialog
        noteTitle={note.title}
        html={editorJsToHtml(JSON.parse(note.body).blocks)}
        open={exportAsHTML}
        setOpen={setExportAsHTML}
      />
    </DropdownMenu>
  );
};

export default NoteDropDownMenu;
