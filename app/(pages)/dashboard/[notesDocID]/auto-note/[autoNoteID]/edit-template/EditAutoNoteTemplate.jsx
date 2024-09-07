'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import EditorJS from '@editorjs/editorjs';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { editorConfig } from '@/app/utils/editor';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

const EditAutoNoteTemplate = ({ params }) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const { autoNotes, user } = useSelector((state) => state.note);
  const [blocks, setBlocks] = useState();
  const editorInstance = useRef(null);
  const [loading, setLoading] = useState(false);
  const [autoNote, setAutoNote] = useState();
  const { toast } = useToast();

  useEffect(() => {
    autoNotes.map((autoNote) => {
      if (autoNote.autoNoteID === params.autoNoteID) {
        setAutoNote(autoNote);
        setBlocks(autoNote.template.body);
      }
    });
  }, [autoNotes, params.autoNoteID]);

  useEffect(() => {
    if (!blocks) return;

    const editor = new EditorJS({
      ...editorConfig,
      data: blocks,
    });

    editorInstance.current = editor;

    return () => {
      if (
        editorInstance.current &&
        typeof editorInstance.current.destroy === 'function'
      ) {
        editorInstance.current.destroy();
      }
      editorInstance.current = null;
    };
  }, [blocks]);

  const handleSave = () => {
    try {
      setLoading(true);
      editorInstance.current.save().then(async (outputData) => {
        const templateBody = outputData.blocks;
        await axios.put(
          `${process.env.API}/api/auto-notes/update/${params.autoNoteID}`,
          { template: { body: { blocks: templateBody } } },
          { headers: { notesDocID: user.userData.notesDocID } },
        );
      });
      setLoading(false);
      toast({
        description: (
          <span>
            <span className="font-bold">{autoNote.autoNoteName}</span> updated!
          </span>
        ),
        className: 'bg-green-500',
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="h-full box-border">
      <ScrollArea>
        <div
          className={cn(
            !isDesktop &&
              'flex items-center mt-4 mb-1 mx-1 justify-between print:hidden',
            isDesktop && 'flex justify-end gap-2 print:hidden',
          )}
        >
          <span className="text-2xl font-semibold">Edit template</span>
          <Button
            disabled={loading}
            className="disabled:cursor-not-allowed font-semibold"
            onClick={handleSave}
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="h-[18px] animate-spin" /> Loading...
              </div>
            ) : (
              'Save changes'
            )}
          </Button>
        </div>
        <Separator className="my-2" />
        <div
          id="editorjs"
          className={cn(
            !isDesktop && 'px-1 mx-1',
            isDesktop && 'px-20 py-4 ',
            'border rounded-md',
          )}
        ></div>
        <ScrollBar />
      </ScrollArea>
    </section>
  );
};

export default EditAutoNoteTemplate;
