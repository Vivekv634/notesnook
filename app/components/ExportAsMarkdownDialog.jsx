import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import download from 'downloadjs';
import { Download } from 'lucide-react';
import pretty from 'pretty';
import { CodeBlock, dracula } from 'react-code-blocks';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { useMediaQuery } from 'usehooks-ts';

export default function ExportAsMarkdownDialog({
  html,
  noteTitle,
  open,
  setOpen,
}) {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const formattedHTML = pretty(html, { ocd: true });
  const turndownServices = new TurndownService();
  turndownServices.use(gfm);
  const Markdown = turndownServices.turndown(formattedHTML);
  const { toast } = useToast();

  function copy() {
    try {
      download(Markdown, `${noteTitle}.md`);
      setOpen(false);
    } catch (error) {
      setOpen(false);
      toast({
        description: 'Oops! something went wrong. Try again!',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {html ? (
          <div className="overflow-auto">
            <DialogHeader>
              <DialogTitle>Download Note as Markdown</DialogTitle>
            </DialogHeader>
            <div className="max-h-52 my-3 overflow-auto">
              <CodeBlock text={Markdown} language="bash" theme={dracula} />
            </div>
            <DialogFooter>
              <DialogClose
                className={cn(buttonVariants({ variant: 'secondary' }))}
              >
                Close
              </DialogClose>
              <Button
                onClick={copy}
                className={cn(!isDesktop && 'my-2', 'font-semibold')}
              >
                Download File <Download className="h-4 w-7" />
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="flex justify-center">Note is Empty</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
