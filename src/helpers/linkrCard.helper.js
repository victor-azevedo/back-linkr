import urlMetadata from "url-metadata";
import { usersLikedLinks } from "../repository/linkrs.repositories.js";
import { getRepostsByLinkrId } from "../repository/repost.repositories.js";

export async function insertMetadataIntoLinkrCard(linkrCardArray) {
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
                        image: "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930",
                    },
                };
            }
        })
    );
    return linkrsWithMetadata;
}

export async function insertLikesIntoLinkrCard(linkrCardArray, authenticatedUsername) {
    const queryLikesResult = await usersLikedLinks();
    const linksLikes = [...queryLikesResult.rows];

    const linkrsWithLikes = linkrCardArray.map((linkr) => {
        const linkLikesFound = linksLikes.find(({ linkId }) => {
            return Number(linkId) === Number(linkr.id);
        });
        delete linkr.likerId;
        if (linkLikesFound) {
            const usersLiked = [...linkLikesFound.likers];
            const count = linkLikesFound.likers.length;
            const linkIsLikedByUser = linkLikesFound.likers.includes(authenticatedUsername);
            return {
                ...linkr,
                likes: {
                    linkIsLikedByUser,
                    usersLiked,
                    count,
                },
            };
        } else {
            return {
                ...linkr,
                likes: {
                    linkIsLikedByUser: false,
                    usersLiked: [],
                    count: 0,
                },
            };
        }
    });

    return linkrsWithLikes;
}

export async function insertRepostsNumberIntoLinkrCard(linkrCardArray){

    const repostQuantity = await getRepostsByLinkrId();
  
    const linkrsWithRepostsNumber = linkrCardArray.map((linkr) => {
        const linkRepostsFound = repostQuantity.find(({ linkrId }) => {
            return Number(linkrId) === Number(linkr.id);
        }); 

        if (linkRepostsFound) {
            const repostsNumber = linkRepostsFound.count;
            return {
                ...linkr,
                repostsNumber: (repostsNumber),
            };
        } else {
            return {
                ...linkr,
                repostsNumber: 0,
            };
        }
    });
    
    return linkrsWithRepostsNumber;
}
    