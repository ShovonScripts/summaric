import { EditBookForm } from "./edit-book-form";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditBookForm id={id} />;
}
