const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Load post model
const Post = require('../../models/Post')
// Load Profile model
const Profile = require('../../models/Profile')


// Load post validation
const validatePostInput = require('../../validation/post')

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: "Posts Works" }))

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const newPost = new Post ({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  })

  // Save post
  newPost.save().then(post => res.json(post))
})

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err))
})

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  const errors = {}

  Post.findById(req.params.id)
    .sort({ date: -1 })
    .then(profile => res.json(profile))
    .catch(err => {
      errors.postnotfound = 'Post does not exist'
      res.status(404).json(errors)
    })
})

// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User no authorized'})
          }

          // Delete post
          post.remove().then(() => res.json({ success: true}))
        })
        .catch(err => res.status(404).json({ postnotfound: 'Post not found' }))
    })
    .catch(err => res.status(400).json(err))
})



module.exports = router