import  express  from "express";
const router = express.Router();
import { getConversations,createConversations,getMessages,sendMessages } from "../Controllers/ConversationConroller.js";

/*Start a new Convesation */
router.post('/create-conversations',createConversations)
/** Get a user Conversation from database if match userId */

router.get('/get-conversations',getConversations)

router.post('/get-messages/',getMessages)
router.post('/send-messages/',sendMessages)

export default router;