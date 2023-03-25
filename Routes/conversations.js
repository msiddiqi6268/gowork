import  express  from "express";
const router = express.Router();
const Conversation = '../Models/Conversation.js';

/*Start a new Convesation */
router.post('/', async (req, res)=>{
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receicerId]
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (error) {
        res.status(500).json(error)
    }
});


export default router;