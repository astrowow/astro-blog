import { DocumentTextIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { defineField, defineType } from "sanity";

import authorType from "./author";

/**
 * This file is the schema definition for a post.
 *
 * Here you'll be able to edit the different fields that appear when you 
 * create or edit a post in the studio.
 * 
 * Here you can see the different schema types that are available:

  https://www.sanity.io/docs/schema-types

 */

export default defineType({
  name: "post",
  title: "Post",
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
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          name: "contentImage",
          title: "Image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
              validation: (rule: any) => rule.required(),
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional caption for the image.",
            },
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
                    {
                      name: "caption",
                      type: "string",
                      title: "Caption",
                      description: "Optional caption for the image.",
                    },
                  ],
                },
              ],
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional caption for the gallery.",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            });
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "categories",
      title: "Categorías",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      description: "Selecciona una o más categorías para este post.",
    }),
    defineField({
      name: "authors",
      title: "Autores",
      type: "array",
      of: [{ type: "reference", to: [{ type: authorType.name }] }],
      description: "Selecciona uno o varios autores para este post.",
      validation: (rule) => rule.min(1).error("Debe haber al menos un autor"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      authors: "authors",
      date: "date",
      media: "coverImage",
    },
    prepare({ title, media, authors, date }) {
      const formatDate = (dateString: string) => {
        const formatted = format(parseISO(dateString), "LLL d, yyyy", { locale: es });
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
      };

      const authorLabel = Array.isArray(authors) && authors.length
        ? `${authors.length} autor${authors.length > 1 ? "es" : ""}`
        : undefined;

      const subtitles = [
        authorLabel && `por ${authorLabel}`,
        date && `el ${formatDate(date)}`,
      ].filter(Boolean);

      return {
        title,
        subtitle: subtitles.join(" · ") || undefined,
        media,
      };
    },
  },
});
