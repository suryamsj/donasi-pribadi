import { PUSHER_CLUSTER, PUSHER_ID, PUSHER_KEY, PUSHER_SECRET } from "$env/static/private";
import Pusher from "pusher";

export const pusher = new Pusher({
  appId: PUSHER_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: PUSHER_CLUSTER,
  useTLS: true
});
