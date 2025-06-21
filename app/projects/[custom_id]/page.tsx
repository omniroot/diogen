export default async function ProjectPage({
  params,
}: {
  params: Promise<{ custom_id: string }>;
}) {
  const { custom_id } = await params;

  return <div>project {custom_id}</div>;
}
