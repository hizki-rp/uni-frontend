import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

const LoadingSpinner = ({ size = "medium", className, text }) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-16 w-16",
    large: "h-24 w-24",
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-4 h-64",
        className
      )}
    >
      <Loader
        className={cn("animate-spin text-[#31ccbc]", sizeClasses[size])}
      />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
