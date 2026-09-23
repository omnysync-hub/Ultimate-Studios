import type { StructureResolver } from "sanity/structure";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Ultimate Cineverse")
    .items([
      S.listItem()
        .title("Blog posts")
        .schemaType("post")
        .child(S.documentTypeList("post").title("Blog posts").defaultOrdering([{ field: "datePublished", direction: "desc" }])),
      S.listItem()
        .title("Authors")
        .schemaType("author")
        .child(S.documentTypeList("author").title("Authors")),
      S.divider(),
      S.listItem()
        .title("Comments")
        .child(
          S.list()
            .title("Comments")
            .items([
              S.listItem()
                .title("Needs review")
                .child(
                  S.documentList()
                    .title("Needs review")
                    .filter('_type == "comment" && approved != true')
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }])
                ),
              S.listItem()
                .title("Approved")
                .child(
                  S.documentList()
                    .title("Approved")
                    .filter('_type == "comment" && approved == true')
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }])
                ),
              S.listItem()
                .title("All comments")
                .schemaType("comment")
                .child(S.documentTypeList("comment").title("All comments"))
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !["post", "author", "comment"].includes(item.getId() || "")
      )
    ]);
