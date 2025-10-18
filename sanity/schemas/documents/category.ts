import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "El slug se usa en la URL. Sin espacios, minúsculas y guiones (-).",
      options: {
        source: "name",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/--+/g, "-")
            .slice(0, 96),
      },
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            const v = value?.current as string | undefined;
            if (!v || v.length === 0) return "El slug es obligatorio";
            if (v.length > 96)
              return "El slug debe tener máximo 96 caracteres";
            if (/\s/.test(v))
              return "El slug no puede tener espacios. Usa guiones (-)";
            if (!/^[a-z0-9-]+$/.test(v))
              return "Solo letras minúsculas, números y guiones";
            if (/--/.test(v)) return "Evita guiones dobles";
            if (/^-|-$/.test(v)) return "No empieces ni termines con guión";
            return true;
          }),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "slug.current",
    },
    prepare({ title, subtitle }) {
      return { title: title || "Untitled", subtitle };
    },
  },
});