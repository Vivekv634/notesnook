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
import { Copy } from 'lucide-react';
import pretty from 'pretty';
import { CodeBlock, dracula } from 'react-code-blocks';
import { useMediaQuery } from 'usehooks-ts';

export default function CopyAsHTMLDialog({ html, open, setOpen }) {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const formattedHTML = pretty(html, { ocd: true });
  const { toast } = useToast();

  function copy() {
    try {
      navigator.clipboard.writeText(formattedHTML);
      setOpen(false);
      toast({
        description: 'HTML copied to clipboard!',
        className: 'bg-green-500',
      });
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
              <DialogTitle>Copy Note as HTML</DialogTitle>
            </DialogHeader>
            <div className="max-h-52 my-3 overflow-auto">
              <CodeBlock text={formattedHTML} language="html" theme={dracula} />
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
                Copy HTML <Copy className="h-4 w-7" />
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
