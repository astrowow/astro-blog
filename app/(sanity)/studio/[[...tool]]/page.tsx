import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

export const metadata = {
  title: "Sanity Studio",
  description: "Panel de administración de contenido",
};

export const dynamic = "force-dynamic";
export const revalidate = false;

export default function StudioPage() {
  return <NextStudio config={config} />;
}
