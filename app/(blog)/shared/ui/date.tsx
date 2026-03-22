export default function DateComponent({
  dateString,
  format = "default",
}: {
  dateString: string;
  format?: "default" | "shortMonthYear";
}) {
  const date = new Date(dateString);
  let displayedDate = "";

  if (format === "shortMonthYear") {
    const month = new Intl.DateTimeFormat("es-ES", { month: "short" }).format(date).replace('.', '');
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    const day = date.getDate();
    const year = date.getFullYear();
    displayedDate = `${capitalizedMonth} ${day}, ${year}`;
  } else {
    displayedDate = new Intl.DateTimeFormat("es-ES", {
      dateStyle: "long",
    }).format(date);
    displayedDate = displayedDate.charAt(0).toUpperCase() + displayedDate.slice(1);
  }

  return (
    <time dateTime={dateString} className="font-mono uppercase text-neutral-500">
      {displayedDate}
    </time>
  );
}
