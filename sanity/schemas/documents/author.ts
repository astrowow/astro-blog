import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  icon: UserIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    // Add slug for author profile URLs
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "El slug se usa en la URL del autor. Sin espacios, minúsculas y guiones (-).",
      options: {
        source: "name",
        maxLength: 64,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/--+/g, "-")
            .slice(0, 64),
      },
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            const v = value?.current as string | undefined;
            if (!v || v.length === 0) return "El slug es obligatorio";
            if (v.length > 64)
              return "El slug debe tener máximo 64 caracteres";
            if (/\s/.test(v))
              return "El slug no puede tener espacios. Usa guiones (-)";
            if (!/^[a-z0-9-]+$/.test(v))
              return "Solo letras minúsculas, números y guiones";
            if (/--/.test(v)) return "Evita guiones dobles";
            if (/^-|-$/.test(v)) return "No empieces ni termines con guión";
            return true;
          }),
    }),
    // Public bio for author profile
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "H5", value: "h5" },
            { title: "H6", value: "h6" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                title: "URL",
                name: "link",
                type: "object",
                fields: [{ title: "URL", name: "href", type: "url" }],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "picture",
      title: "Picture",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.picture as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            });
          },
        },
      ],
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
