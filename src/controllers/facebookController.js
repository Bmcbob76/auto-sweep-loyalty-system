const facebookService = require('../services/facebookService');

class FacebookController {
  // Verify webhook
  verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const result = facebookService.verifyWebhook(mode, token, challenge);
    
    if (result) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }

  // Handle webhook events
  async handleWebhook(req, res) {
    try {
      const body = req.body;

      if (body.object === 'page') {
        // Process each entry
        for (const entry of body.entry) {
          const webhookEvent = entry.messaging[0];
          const senderId = webhookEvent.sender.id;

          if (webhookEvent.message) {
            await facebookService.handleMessage(senderId, webhookEvent.message);
          }
        }

        res.status(200).send('EVENT_RECEIVED');
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error('Facebook webhook error:', error);
      res.sendStatus(500);
    }
  }

  // Post announcement to group
  async postToGroup(req, res) {
    try {
      const { groupId, message } = req.body;
      const result = await facebookService.postToGroup(groupId, message);

      res.json({
        message: 'Posted successfully',
        result
      });
    } catch (error) {
      console.error('Post to group error:', error);
      res.status(500).json({ error: 'Failed to post to group' });
    }
  }
}

module.exports = new FacebookController();
