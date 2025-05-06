
import React from 'react';
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EditMessageProps {
  content: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditMessage = ({ content, onChange, onSave, onCancel }: EditMessageProps) => {
  return (
    <div className="space-y-2 flex-1">
      <Textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[350px] border-desyr-soft-gold/30 text-lg"
        autoFocus
      />
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancel}
          className="text-desyr-taupe"
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onSave}
          className="gold-button"
        >
          <Check className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditMessage;
