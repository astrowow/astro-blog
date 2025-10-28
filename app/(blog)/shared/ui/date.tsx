import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function DateComponent({ dateString }: { dateString: string }) {
  const formattedDate = format(new Date(dateString), "LLLL d, yyyy", { locale: es });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  
  return (
    <time dateTime={dateString}>
      {capitalizedDate}
    </time>
  );
}
