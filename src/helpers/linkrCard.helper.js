import urlMetadata from "url-metadata";
import { usersLikedLinks } from "../repository/linkrs.repositories.js";


export async function insertMetadataIntoLinkrCard(linkrCardArray){
    const linkrsWithMetadata = await Promise.all(
        linkrCardArray.map(async (linkr) => {
          try {
            const linkMetadata = await urlMetadata(linkr.linkUrl);
            const { title, description, image } = linkMetadata;
            const linkrWithMetadata = {
              ...linkr,
              linkMetadata: { title, description, image },
            };
            return linkrWithMetadata;
          } catch (error) {
            return {
              ...linkr,
              linkMetadata: {
                title: "",
                description: "",
                image:
                  "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930",
              },
            };
          }
        })
      );
  return linkrsWithMetadata;
}

export async function insertLikesIntoLinkrCard(linkrCardArray){

    const queryLikesResult = await usersLikedLinks();
    const linksLikes = [...queryLikesResult.rows];

    const linkrsWithLikes = linkrCardArray.map(
        (linkr) => {
          const linkLikesFound = linksLikes.find(
            ({ linkId }) => Number(linkId) === Number(linkr.id)
          );
          const linkIsLikedByUser = linkr.likerId ? true : false;
          delete linkr.likerId;
          return linkLikesFound
            ? {
                ...linkr,
                likes: {
                  linkIsLikedByUser,
                  usersLiked: [...linkLikesFound.likers],
                  count: linkLikesFound.likers.length,
                },
              }
            : {
                ...linkr,
                likes: {
                  linkIsLikedByUser,
                  usersLiked: [],
                  count: 0,
                },
              };
        }
      );

      return linkrsWithLikes;

}
