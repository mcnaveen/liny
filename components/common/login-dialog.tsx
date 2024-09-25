import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export const LoginDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
