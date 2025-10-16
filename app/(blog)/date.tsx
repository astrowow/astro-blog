import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function DateComponent({ dateString }: { dateString: string }) {
  return (
    <time dateTime={dateString}>
      {format(new Date(dateString), "LLLL d, yyyy", { locale: es })}
    </time>
  );
}
