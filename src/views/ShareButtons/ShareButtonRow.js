/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share'

const {
  FacebookShareButton,
  TwitterShareButton
} = ShareButtons

const {
  FacebookShareCount
} = ShareCounts

const FacebookIcon = generateShareIcon('facebook')
const TwitterIcon = generateShareIcon('twitter')

const ShareButtonRow = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return false
  },
  render () {
    const shareUrl = 'http://davedave.us/wavetable-synth/'
    const title = 'Wavetable Synth'
    const shareImage = 'http://davedave.us/wavetable-synth/images/share-image.png'
    return (
      <div className='share-button-row'>
        <div className='share-button-container'>
          <FacebookShareButton
            url={shareUrl}
            title={title}
            picture={shareImage}
            className='share-button'>
            <FacebookIcon
              size={24}
              round />
          </FacebookShareButton>

          <FacebookShareCount
            url={shareUrl}
            className='share-count'>
            {count => count}
          </FacebookShareCount>
        </div>

        <div className='share-button-container'>
          <TwitterShareButton
            url={shareUrl}
            title={title}
            className='share-button'>
            <TwitterIcon
              size={24}
              round />
          </TwitterShareButton>

          <div className='share-count' />
        </div>
      </div>
    )
  }
})
export default ShareButtonRow
