
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditConceptDialogProps {
  isOpen: boolean;
  conceptName: string;
  onClose: () => void;
  onChange: (name: string) => void;
  onSave: () => void;
}

const EditConceptDialog = ({
  isOpen,
  conceptName,
  onClose,
  onChange,
  onSave,
}: EditConceptDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Asset Name</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input 
            id="edit-asset-name"
            value={conceptName}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter new asset name"
            className="w-full mb-4"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            disabled={!conceptName}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditConceptDialog;
