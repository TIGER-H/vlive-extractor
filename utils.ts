export async function getInkey(videoSeq: string) {
  const baseUrl = "https://www.vlive.tv/globalv-web/vam-web/video/v1.0/vod/";
  const url = new URL(`${baseUrl}${videoSeq}/inkey`);
  url.search = new URLSearchParams({
    appId: "8c6cc7b45d2568fb668be6e05b6e5a3b",
    platformType: "PC",
    gcc: "KR",
  }).toString();

  const { inkey } = await fetch(url.toString(), {
    headers: {
      Referer: "https://www.vlive.tv/post/",
    },
  }).then((r) => r.json());
  return inkey as string;
}

export const getPostByPostId = async (postId: string) => {
  const postDataRes = await fetch(
    `https://www.vlive.tv/globalv-web/vam-web/post/v1.0/post-${postId}?appId=8c6cc7b45d2568fb668be6e05b6e5a3b&fields=attachments,author,authorId,availableActions,board{boardId,title,boardType,readAllowedLabel,payRequired,includedCountries,excludedCountries},boardId,body,channel{channelName,channelCode},
    channelCode,totalCommentCount,contentType,createdAt,emotionCount,excludedCountries,includedCountries,
    isViewerBookmarked,isCommentEnabled,isHiddenFromStar,lastModifierMember,notice,officialVideo.withSpecialBanner(1),
    originPost,plainBody,postId,postVersion,reservation,starReactions,targetMember,targetMemberId,
    thumbnail,title,url,smartEditorAsHtml,viewerEmotionId,writtenIn`,
    {
      headers: {
        Referer: "https://www.vlive.tv/post/",
      },
    }
  ).then((r) => r.json()).then();
  // remove officialVideo -> recommendedVideos
  postDataRes.officialVideo.recommendedVideos = [];

  return postDataRes;
};

export const getVideoInfo = async (videoSeq: string, vodId: string) => {
  const videoUrl = "https://apis.naver.com/rmcnmv/rmcnmv/vod/play/v2.0/";
  const url = new URL(`${videoUrl}${vodId}`);
  const inkey = await getInkey(videoSeq);

  url.search = new URLSearchParams({
    key: inkey,
  }).toString();

  const videoInfo = await fetch(url.toString(), {
    headers: {
      Referer: "https://www.vlive.tv/",
    },
  }).then((r) => r.json());

  return videoInfo;
};