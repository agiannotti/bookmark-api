const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const STORE = require('../STORE');
const { isWebUri } = require('valid-url');

const router = express.Router();
const bodyParser = express.json();

router
  .route('/bookmarks')
  .get((req, res) => {
    res.json(STORE.bookmarks);
  })
  .post(bodyParser, (req, res) => {
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send(`'${field}' is required`);
      }
    }
    const { title, url, description, rating } = req.body;

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating} provided'`);
      return res.status(400).send(`'rating' provided must be between 0 and 5`);
    }

    if (!isWebUri(url)) {
      logger.error(`Invalid url '${url} provided`);
      return res.status(400).send(`'url' must be a valid url`);
    }

    const bookmark = { id: uuid(), title, url, description, rating };

    STORE.bookmarks.push(bookmark);

    logger.info(`Bookmark with an id of '${bookmark.id} was created`);
    res
      .status(201)
      .location(`http://localhost:8080/bookmarks/${bookmark.id}`)
      .json(bookmark);
  });

router
  .route('/bookmarks/:bookmark_id')
  .get((req, res) => {
    const { bookmark_id } = req.params;

    const bookmark = STORE.bookmarks.find((c) => c.id == bookmark_id);

    if (!bookmark) {
      logger.error(`Bookmark with id ${bookmark_id} not found,`);
      return res.status(404).send('Bookmark not found');
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { bookmark_id } = req.params;

    const bookmarkIndex = STORE.bookmarks.findIndex(
      (b) => b.id === bookmark_id
    );

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`);
      return res.status(204).end();
    }
  });

module.exports = router;
