import express from 'express';
const router = express.Router();
import Message from '../Models/Message.js';

//Add a new message 
router.post('/', async(req, res)=>{
    const newMessage = new Message(req.body);
    try {
        const saveMessage = await newMessage.save();
        res.status(200).json(saveMessage);
    } catch (error) {
        res.status(500).json(error);
    } 
});

//Get a conversation from the database

router.get('/:conversationId', async(req, res)=>{
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;