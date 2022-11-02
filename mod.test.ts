import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts';
import { getInkey, getPostByPostId, getVideoInfo } from "./utils.ts";


Deno.test("getInkey", async () => {
  const inkey = await getInkey("5760");
  assertEquals(typeof inkey, "string");
});

Deno.test("POST: should return post data without recommendVideos", async () => {
  const postId = "0-18261549";
  const postData = await getPostByPostId(postId);

  assertEquals(postData.officialVideo.recommendedVideos.length, 0);
});

Deno.test("POST: should get videoInfo", async () => {
  const videoSeq = "5760";
  const vodId = "B0ADEFA492B00B0621075CCAA60C4818C881";

  const videoInfo = await getVideoInfo(videoSeq, vodId);

  assertEquals(videoInfo.meta.masterVideoId, vodId);
});