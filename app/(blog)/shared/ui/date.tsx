export default function DateComponent({ dateString }: { dateString: string }) {
  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
  }).format(new Date(dateString));
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <time dateTime={dateString}>
      {capitalizedDate}
    </time>
  );
}
