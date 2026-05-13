import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ContactDialog() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          联系我
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 border-0 shadow-lg">
        <img
          src="/qrcode.jpg"
          alt="WeChat QR Code"
          className="w-48 h-auto rounded-lg"
        />
      </PopoverContent>
    </Popover>
  );
}
