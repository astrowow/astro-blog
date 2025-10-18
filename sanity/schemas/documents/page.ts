import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Página genérica (About Me) editable desde el Studio.
 */
export default defineType({
  name: "page",
  title: "Page",
  icon: DocumentTextIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
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
        source: "title",
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
      name: "content",
      title: "Content",
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
        {
          type: "image",
          name: "contentImage",
          title: "Image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
              validation: (rule: any) => rule.required(),
            },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
        {
          type: "object",
          name: "imageGallery",
          title: "Galería de imágenes",
          fields: [
            {
              name: "images",
              title: "Imágenes",
              type: "array",
              of: [
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    {
                      name: "alt",
                      type: "string",
                      title: "Alternative text",
                      description: "Important for SEO and accessibility.",
                      validation: (rule: any) => rule.required(),
                    },
                    { name: "caption", type: "string", title: "Caption" },
                  ],
                },
              ],
            },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
      ],
    }),
  ],
});