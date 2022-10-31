/**
 * a Deno based vlive extractor to preserve my videos & metadata
 */
const channelCode = prompt("Enter channel Code (e.g. F5F127): ", "F5F127")
const boardId = prompt('Enter boardId (e.g. 3773): ', '3773')
const fetchLimit = 100;


const starpostBaseURL = `https://www.vlive.tv/globalv-web/vam-web/post/v1.0/board-${boardId}/posts?appId=8c6cc7b45d2568fb668be6e05b6e5a3b&fields=attachments,author,availableActions,board%7BboardId,title,boardType,payRequired,includedCountries,excludedCountries%7D,channel%7BchannelName,channelCode%7D,totalCommentCount,contentType,createdAt,emotionCount,excludedCountries,includedCountries,isCommentEnabled,isHiddenFromStar,lastModifierMember,notice,officialVideo,plainBody,postId,postVersion,reservation,starReactions,targetMember,thumbnail,title,url,writtenIn,sharedPosts,originPost,blindType&sortType=OLDEST&limit=${fetchLimit}`;

let paging: {
    nextParams?: {
        limit: string;
        after: string;
    }
} = {}

const starpost = [];
let isEnd = false;
let counter = 1;

while (true) {
    console.info(`fetching ${counter * 100} data...`)
    const starpostRes = await fetch(`${starpostBaseURL}${paging.nextParams?.after ? `&after=${paging.nextParams.after}` : ""}`, {
        headers: {
            Referer: `https://www.vlive.tv/channel/${channelCode}`,
            "Referrer-Policy": "strict-origin-when-cross-origin",
        },
    });
    const starpostData = await starpostRes.json();

    starpost.push(...starpostData.data);

    if (Object.keys(starpostData.paging).includes('nextParams')) {
        paging = starpostData.paging;
    } else {
        isEnd = true
    }

    if (isEnd) break;
    counter++;
}

Deno.writeTextFileSync("./meta.json", JSON.stringify(starpost, null, 2));

